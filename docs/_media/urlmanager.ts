
/**
 * @module urlmanager
 * Description: An extension to URL for tracking ObjectURLs and addtional param handling.
 * https://developer.mozilla.org/en-US/docs/Web/API/URL
 * https://datatracker.ietf.org/doc/html/rfc3986
 * 
 * From "Syntax Components" Section 3 (with added HTTP Basic auth)
 * 
 *       foo://user:pass@example.com:8042/over/there?name=ferret#nose
 *       \_/   \________________________/\_________/ \_________/ \__/
 *        |           |                      |            |        |
 *     scheme     authority                 path        query   fragment
 *        |   _______________________________|__
 *       / \ /                                  \
 *       urn:example:animal:ferret:nose
 */

import {
  AnyObject,
} from "../types";
import {
  objectToSearchParams,
  searchParamsToObject,
} from '../utils';

/**
 * Name: URLManager
 * Classdesc: URL class with additional static and instance methods for managing multiple generated URLs
 * @public
 * @class
 * Implements: URL
 */
export class URLManager extends URL {
  // Static
  private static generatedObjectURLS : string[] = [];
  
  /**
   * Override
   * https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
   * @static
   * @public
   * @param obj 
   * @returns string
   */
  static override createObjectURL(obj: File | Blob | MediaSource): string {
    const url = super.createObjectURL(obj);
    this.generatedObjectURLS = this.generatedObjectURLS.concat(url);
    return url;
  }

  /**
   * Name: currentUrl
   * Description: URLManager instance of current url
   * @static
   * @public
   * @returns URLManager
   */
  static get currentUrl(): URL {
    return new URLManager(globalThis.location.href);
  }

  /**
   * Name: objectURLS
   * Description: string[] of objectUrls
   * @static
   * @public
   * @returns string[]
   */
  static get objectURLS() : Readonly<Array<string>> {
    return this.generatedObjectURLS;
  }

  /**
   * Name: revokeObjectURL
   * Description: Override
   * - https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static
   * @static
   * @public
   * @param url
   */
  static override revokeObjectURL(url: string) : void {
    if (this.generatedObjectURLS.includes(url)) {
      this.generatedObjectURLS = this.generatedObjectURLS.filter(u => u !== url);
    }
    super.revokeObjectURL(url);
  }
  
  /**
   * Name: revokeAllObjectURLs
   * Description: revokes all known object urls
   * @static
   * @public
   */
  static revokeAllObjectURLs() {
    this.generatedObjectURLS.forEach(url => this.revokeObjectURL(url));
  }

  /**
   * @constructor
   * @public
   * @param url 
   */
  constructor(url: string) {
    super(url);
  }

  /**
   * Name: params
   * Description: Returns searchParams as Object instead of iterable
   *   - Arrays are repeated keys: `?key=val&key=val2` === { key: ['val', 'val2' ] }
   *   - Objects use dot notation: `?obj.key=val&obj.key=val2&obj.key2=val3` === { obj: { key: ['val', 'val2'], key2: 'val3' } }
   * @public
   * @returns Readonly<AnyObject>
   */
  get params(): Readonly<AnyObject> {
    return searchParamsToObject(this.searchParams);
  }

  // takes object { key: 'val' } and and updates this.search as `?key=val` 
  /**
   * Name: params
   * Description: 
   * @public
   * @param data Anyobject of params to set
   */
  set params(data: AnyObject) {
    this.search = objectToSearchParams(data);
  }
}

export default URLManager;
