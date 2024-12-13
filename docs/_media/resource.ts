/**
 * @module resource
 * Description: Dynamically create Resources with managed URIs
 * https://www.iana.org/assignments/media-types/media-types.xhtml
 */

import {
  identity,
} from "../combinators";
import type {
  AnyObject,
  ArrowFunction,
  Callable,
  InlineBlocks,
  MimeType,
  TagFunction,
} from "../types";
import {
  URLManager,
} from "../urlmanager";
import {
  interpolate,
} from "../utils";

/**
 * Name: GlobalResource
 * Description: The object representing resources globally
 * @public
 * @typedoc {Object}
 */
export type GlobalResource = {
  controller: string | symbol;
  name: string | symbol;
  url: string;
}

/**
 * Name: Resource
 * Description: The Resource API object
 * @public
 * @template T
 * @typedoc {Object}
 */
export type Resource<T = any> = {
  blob: Blob;
  data: T;
  factory: ArrowFunction;
  name: string | symbol;
  mimeType: MimeType;
  revokeUrl: Callable<null, void>;
  toString: Callable<null, string>;
  url: string;
};

/**
 * Name: CreateResourceParams
 * Description: The Resource API object
 * @public
 * @template T
 * @typedoc {Object}
 */
export interface CreateResourceParams<T = any> extends AnyObject {
  name: string | symbol;
  data: T;
  mimeType: MimeType;
  factory: ArrowFunction; 
}

/**
 * Name: ResourceController class
 * Description: Class for managing multiple Resource instances
 *   Static methods are for global management
 *   Instances are for managing "domains" or different contexts
 *   const rc = new ResourceController(options);
 *   ResourceController.createResource(options): Resource
 *   rc.createImage(options)
 * @class
 * @public
 */
export class ResourceController {
  private static globalResources: Map<string | symbol, GlobalResource> = new Map();
  private static controllerNames: Array<string | symbol> = [];

  private static create(params: GlobalResource): void {
    const {
      controller,
      name,
    } = params;
    this.globalResources.set(`${controller.toString()}/${name.toString()}`, params);
  }

  private static delete(controller: string | symbol, name: string | symbol): boolean {
    return this.globalResources.delete(`${controller.toString()}/${name.toString()}`);
  }

  private static get(controller: string | symbol, name: string | symbol): GlobalResource | void {
    return this.globalResources.get(`${controller.toString()}/${name.toString()}`);
  }

  private static update(params: GlobalResource): void {
    const {
      controller,
      name,
      url,
    } = params;
    const gr = this.get(controller, name);
    if (gr) {
      gr.url = url;
      this.globalResources.set(`${controller.toString()}/${name.toString()}`, gr);
    }
  }

  static list(): Readonly<AnyObject> {
    const resources: AnyObject = {};
    for (const [name, globalResource] of this.globalResources) {
      const [controllerName, resourceName] = name.toString().split('/');
      resources[controllerName] = resources[controllerName] ?? {}; 
      resources[controllerName][resourceName] = globalResource;
    }
    return resources;
  }

  /**
   * Ensures strings do not contain a colon `:` in them.
   * @param str 
   * @returns 
   */
  static validateIdString(str: string): boolean {
    return str.match(/^((?!\/).)*$/i) !== null;
  }

  private controllerName: string | symbol;
  private controllerResources: Map<string | symbol, Resource> = new Map();
  private names: Array<string | symbol> = [];

  constructor(name: string | symbol) {
    if (!ResourceController.validateIdString(name.toString())) {
      throw new Error(`Controller: '${name.toString()}' must not include the character ':'.`);
    }
    if (ResourceController.controllerNames.includes(name)) {
      throw new Error(`Controller: '${name.toString()}' already taken.`);
    }
    this.controllerName = name;
    ResourceController.controllerNames.push(name);
  }

  /**
   * Name: name
   * Description: lists name
   * @public
   * @returns Readonly<string>
   */
  get name(): Readonly<string> {
    return this.controllerName.toString();
  }

  /**
   * Name: resources
   * Description: lists resources
   * @public
   * @returns Readonly<Record<string, Resource>> 
   */
  get resources(): Readonly<Record<string, Resource>> {
    const resources: AnyObject = {};
    for (const [name, resource] of this.controllerResources) {
      resources[name.toString()] = resource;
    }
    return resources;
  }
  
  /**
   * Name: create
   * Description: create resource
   * @public
   * @param params CreateResourceParams<T>
   * @returns void | Readonly<Resource<T>>
   */
  create<T = any>(params: CreateResourceParams<T>): void | Readonly<Resource<T>> {
    try {
      const {
        name,
      } = params;
      if (!ResourceController.validateIdString(name.toString())) {
        throw new Error(`Resource: '${name.toString()}' must not include the character ':'.`);
      }
      if (this.names.includes(name)) {
        throw new Error(`Resource: '${name.toString()}' already taken.`);
      }
      // No default options for resource
      const resource = createResource(params)();
      this.controllerResources.set(name, resource);
      // Update static data for list()
      if (ResourceController.get(this.controllerName, resource.name)) {
        ResourceController.update({
          controller: this.controllerName,
          name: resource.name,
          url: resource.url,
        })
      } else { 
        ResourceController.create({
          controller: this.controllerName,
          name: resource.name,
          url: resource.url,
        });
      }
      return resource;
    } catch(err: any) {
      console.warn(err);
    }
  }

  /**
   * Name: delete
   * Description: delete resource by name
   * @public
   * @param params name
   * @returns boolean
   */
  delete(name: string | symbol): boolean {
    try {
      const resource = this.controllerResources.get(name.toString());
      if (resource) {
        resource.revokeUrl();
        return this.controllerResources.delete(name) &&
               ResourceController.delete(this.controllerName, name);
      }
      return false;
    } catch(err: any) {
      console.warn(err);
      return false;
    }
  }

  /**
   * Name: get
   * Description: gets resource by name
   * @public
   * @param params name
   * @returns void | Readonly<Resource<T>>
   */
  get(name: string | symbol): void | Readonly<Resource> {
    return this.controllerResources.get(name);
  }
  
  /**
   * Name: update
   * Description: updates resource by name
   * @public
   * @param params CreateResourceParams<T>
   * @returns void | Readonly<Resource<T>>
   */
  update<T = any>(params: Partial<CreateResourceParams<T>>): void | Readonly<Resource<T>> {
    try {
      const resource = this.controllerResources.get(params.name);
      // instance
      const {
        data = resource.data,
        mimeType = resource.mimeType,
        name,
        factory = resource.factory,
      } = params;
      resource.revokeUrl();
      const updatedResource = createResource({
        data,
        factory,
        mimeType,
        name,
      })();
      this.controllerResources.set(name, updatedResource);
      // static
      if (ResourceController.get(this.controllerName, resource.name)) {
        ResourceController.update({
          controller: this.controllerName,
          name: resource.name,
          url: resource.url,
        })
      } else {
        ResourceController.create({
          controller: this.controllerName,
          name: resource.name,
          url: resource.url,
        });
      }
      return updatedResource;
    } catch(err: any) {
      console.warn(err);
    }
  }
}

/**
 * Name: createTextResource
 * Description: A tagged function factory for text resources
 *  Script tagged function
 *  Usage:
 *  const taskScript = createScript({
 *    mimeType: 'text/javascript',
 *    name: 'myScriptForTask',
 *    factory: (inlineScrript) => {
 *      return `
 *        // script defaults, etc
 *        ${inlineScript}
 *      `;
 *    }
 *  });
 *  const script = taskScript`
 *    // process work
 *    self.addEventListener('message', callback);
 *  `;
 * @public
 * @param params CreateTextResourceParams
 * @returns TagFunction
 */
type CreateTextResourceParams =  {
  name: string | symbol;
  mimeType?: `text/${string}`;
  factory?: ArrowFunction; 
}
export const createTextResource = (params: CreateTextResourceParams & AnyObject): TagFunction => {
  return (strings: TemplateStringsArray, ...values: InlineBlocks): Resource<string> => {
    const {
      factory = identity,
      mimeType = 'text/javascript',
      name,
      ...restParams
    } = params;

    let generatedUrl: string;

    return {
      get blob () {
        return new Blob([this.toString()], { type: mimeType });
      },
      get data() {
        return interpolate(strings, values, restParams);
      },
      get factory() {
        return factory;
      },
      get mimeType() {
        return mimeType;
      },
      get name() {
        return name;
      },
      revokeUrl() {
        URLManager.revokeObjectURL(generatedUrl);
        generatedUrl = '';
      },
      toString() {
        return factory(this.data);
      },
      get url() {
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
        // - createObjectURL(blob) returns a different UUID formated blob:http(s) every invocation.
        if (!generatedUrl || generatedUrl.length === 0) {
          generatedUrl = URLManager.createObjectURL(this.blob);
        }
        return generatedUrl;
      }
    }
  };
};

/**
 * Name: createResource
 * Description: createResource API constructor
 * @public
 * @template T
 * @param params CreateResourceParams<T> 
 * @returns Resource<T>
 */
export const createResource = <T = any>(defaultParams: CreateResourceParams<T>)  => {
  return (params: Partial<CreateResourceParams<T>> = {}): Resource<T> => {
    const {
      data,
      mimeType,
      name,
      factory = identity,
    } = {
      ...defaultParams,
      ...params,
    };

    let generatedUrl: string;

    return {
      get blob () {
        return new Blob([this.data], { type: mimeType });
      },
      get data() {
        return data;
      },
      get factory() {
        return factory;
      },
      get mimeType() {
        return mimeType;
      },
      get name() {
        return name;
      },
      revokeUrl() {
        URLManager.revokeObjectURL(generatedUrl);
        generatedUrl = undefined;
      },
      toString() {
        return factory(this.data);
      },
      get url() {
        // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
        // - createObjectURL(blob) returns a different UUID formated blob:http(s) every invocation.
        if (!generatedUrl) {
          generatedUrl = URLManager.createObjectURL(this.blob);
        }
        return generatedUrl;
      }
    }
  };
};
    
export default ResourceController;
