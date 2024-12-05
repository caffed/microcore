/**
 * @module httpclient
 * Description: Generic async HTTP client with middleware support for Request and Response handling.
 **/
import {
  createMiddlewareApi,
  MiddlewareParams,
} from "../middleware";
import {
  AnyObject,
  TypedArray,
} from "../types";

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body
 * Name: RequestBody
 * Description: Union type covering all possible RequestBody types.
 * @public
 * @typedef {ArrayBuffer | Blob | BodyInit | DataView | FormData | string | TypedArray | URLSearchParams} RequestBody
 */
export type RequestBody = 
  | ArrayBuffer
  | Blob
  | BodyInit
  | DataView
  | FormData
  | string
  | TypedArray
  | URLSearchParams;

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Priority
 * Name: RequestPriority
 * Description: Union type covering all possible RequestBody types for use with the RequestInit.
 * @public
 * @typedef {'auto' | 'high' | 'low'} RequestPriority
 */
export type RequestPriority =
  | 'auto'
  | 'high'
  | 'low';

/**
 * https://datatracker.ietf.org/doc/html/rfc2616#section-5.1.1
 * Name: HTTPMethods
 * Description: Methods supported by XMLHttpRequest or fetch.
 * @public
 * @enum {string}
 */
export enum HTTPMethods {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

/**
 * https://datatracker.ietf.org/doc/html/rfc2616#section-5.1.1
 * Name: HTTPMethodValues
 * Description: Methods supported by XMLHttpRequest or fetch.
 * @public
 * @typedef {string} - Union type of HTTPMethods string values
 */
export type HTTPMethodValues = `${HTTPMethods}`;

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Attribution_Reporting_API
 * Name: AttributionReportingOptions
 * Description: Options for attributionReporting. Experimental and might be removed.
 * @public
 * @typedef {Object} AttributionReportingOptions
 * @property {boolean} eventsourceeligible
 * @property {boolean} triggereligible
 */
export type AttributionReportingOptions = {
  eventsourceeligible: boolean;
  triggereligible: boolean;
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
 * Name: RequestInit
 * Description: Request used for overload of `fetch(string | URL, RequestInit)` vs. `fetch(Request)`
 * @public
 * @typedef {Object} RequestInit
 * @property {AttributionReportingOptions} attributionReporting
 * @property {RequestBody} body
 * @property {boolean} browsingTopics
 * @property {RequestCache} cache
 * @property {RequestCredentials} credentials
 * @property {Headers} headers
 * @property {string} integrity
 * @property {boolean} keepalive
 * @property {HTTPMethods} method
 * @property {RequestMode} mode
 * @property {RequestPriority} priority 
 * @property {RequestRedirect} redirect
 * @property {'' | 'about:client' | URL['href']} referrer
 * @property {ReferrerPolicy} referrerPolicy
 * @property {AbortSignal | null} signal
 */
export type RequestInit = {
  attributionReporting?: AttributionReportingOptions;
  body?: RequestBody;
  browsingTopics?: boolean;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: Headers;
  /**
   * While integrity is not officially listed as optional,
   * it has a default value of an empty string so it is technically optional.
   */
  integrity?: string;
  keepalive?: boolean;
  method?: HTTPMethodValues;
  mode?: RequestMode;
  priority?: RequestPriority;
  redirect?: RequestRedirect;
  referrer?: '' | 'about:client' | URL['href'];
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
}; 

/**
 * Name: FetchParams
 * Description: Params type for fetch request with signature of `fetch(request, RequestInit)`
 * @public
 * @typedef {Object} FetchParams
 * @property {Request | URL | string} request
 * @property {RequestInit} options
 */
export type FetchParams = [
  request:
    | Request
    | string
    | URL,
  requestInitOptions?: RequestInit,
];

/**
 * Name: HTTPCLIENT_ACTIONS
 * Description: HttpClient actions to be used for middleware or similar
 * @public
 * @readonly
 * @enum {string}
 */
export enum HTTPCLIENT_ACTIONS {
  HTTP_REQUEST = 'HTTP_REQUEST',
  HTTP_RESPONSE = 'HTTP_RESPONSE',
}

/**
 * Name: HttpClientParams
 * Description: Params type for HttpClient
 * @public
 * @typedef {Object} HttpClientParams
 * @property {Request | URL | string} request
 * @property {RequestInit} options
 */
export type HttpClientParams = {
  abortControllerOptions?: {
    reason?: string;
    timeout?: number;
  };
  middlewareOptions?: AnyObject;
  requestInitOptions?: RequestInit;
  request:
    | Request
    | string
    | URL;
};

/**
 * Name: HttpClient
 * Description: fetch request factory with request and response middleware support
 * Function:
 * @public
 * @param defaultParams HttpClientParams  
 * @returns {(requestInit?: RequestInit): Promise<R>}  async http client
 */
export function HttpClient<R = any>(defaultParams: HttpClientParams & MiddlewareParams) {
  const {
    abortControllerOptions = {},
    createApi,
    middleware,
    middlewareOptions = {},
    request,
    requestInitOptions = {},
    sort,
    transform,
  } = defaultParams;

  const {
    reason = 'Controller was aborted.',
    timeout = 5000,
  } = abortControllerOptions;

  let {
    signal,
  } = requestInitOptions;

  if (!signal) {
    const controller = new AbortController();
    const timeoutSignal = AbortSignal.timeout(timeout);
    signal = AbortSignal.any([controller.signal, timeoutSignal]);
    setTimeout(() => controller.abort(reason), timeout);
  }
  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return async (requestInit?: RequestInit) : Promise<R> => {
    const mergedOptions = {
      ...requestInitOptions,
      ...requestInit,
    };
    const { requestOptions } = <{ requestOptions: FetchParams }>api({
        action: {
          data: {
            options: middlewareOptions,
          },
          type: HTTPCLIENT_ACTIONS.HTTP_REQUEST,  
        },
      })
      .middleware({
        requestOptions: [
          request,
          {
            ...mergedOptions,
            ...{ signal },
          },
        ],
      });
    const result = await fetch(...requestOptions);
    return api({
        action: {
          data: {
            options: middlewareOptions,
          },
          type: HTTPCLIENT_ACTIONS.HTTP_RESPONSE,
        },
      }).middleware(result);
  };
};

/**
 * 
 * Name: clientFactory
 * Description: Per method HttpClient factory
 * Function:
 * @public
 * @param method HTTPMethods  
 * @param defaultParams HttpClientParams
 * @returns 
 */
export function clientFactory(method: HTTPMethods, defaultParams: HttpClientParams & MiddlewareParams) {
  return async (params?: HttpClientParams) => {
    const mergedOptions = {
      ...defaultParams,
      ...params,
    };
    mergedOptions.requestInitOptions = mergedOptions.requestInitOptions ?
      {
        ...mergedOptions.requestInitOptions,
        ...{ method },
      } :
      { method };
    return HttpClient(mergedOptions);
  };
};

/**
 * Name: createHttpClient
 * Description: Per path/resource HttpClient factory
 * Function:
 * @public
 * @param defaultParams HttpClientParams
 * @returns {Object} HTTP method factories based of default params
 */
export function createHttpClient(defaultParams: HttpClientParams & MiddlewareParams) {
  return {
    connect: clientFactory(HTTPMethods.CONNECT, defaultParams),
    delete: clientFactory(HTTPMethods.DELETE, defaultParams),
    get: clientFactory(HTTPMethods.GET, defaultParams),
    head: clientFactory(HTTPMethods.HEAD, defaultParams),
    options: clientFactory(HTTPMethods.OPTIONS, defaultParams),
    patch: clientFactory(HTTPMethods.PATCH, defaultParams),
    post: clientFactory(HTTPMethods.POST, defaultParams),
    put: clientFactory(HTTPMethods.PUT, defaultParams),
    trace: clientFactory(HTTPMethods.TRACE, defaultParams),
  }
};
