import { ReactNode } from 'react';

/**
 * Types
 * - These types are used in other packages
 */
/**
 * TypedArray
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
 */
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
/**
 * MimeType type constraint
 * - Organizing body: https://www.iana.org/assignments/media-types/media-types.xhtml
 * - Per: https://www.rfc-editor.org/rfc/rfc4288 section 4.2, total length is 127
 */
type MimeType = `application/${string}` | `audio/${string}` | `font/${string}` | `haptics/${string}` | `image/${string}` | `message/${string}` | `model/${string}` | `multipart/${string}` | `text/${string}` | `video/${string}`;
/**
 * Types used for data
 */
type ReduceFunction<A = any[], C = any, I = any[], R = any> = Callable<[
    accumulator: A,
    current: C,
    index?: number,
    array?: I
], R>;
type ObjectKey = string | symbol | number;
type MapHashKey = ObjectKey | object | ArrowFunction;
interface AnyObject<T = any> {
    [key: ObjectKey]: T;
}
type Json = string | number | boolean | null | Json[] | {
    [key: string]: Json;
};
/**
 * Tagged template literal function parsing types. eg: const result = myTagFunction`template ${variable}`
 * Usage:
 *   const myTagFunction = () : Tagfunction => {
 *     return (strings: TemplateStringsArray, ...values: InlineBlocks) => {
 *       // your custom tagged function code here
 *       // the ./common/strings/interpolate function was written as a convience text parser for tagged function parameters.
 *       return interpolate(strings, values);
 *     }
 *   }
 */
type TaggedFunctionStrings = Readonly<string[]> | TemplateStringsArray;
type InlineBlocks<R = any> = Array<string | ((props: any) => R)>;
type TagFunction<R = any> = (strings: TemplateStringsArray, ...values: InlineBlocks) => R;
/**
 * Callable<Parameters, ReturnType>
 * - Used for defining signatature of function: parameters and return type.
 * - Use tuple types for variadic signatures
 *   example: `type funcParams = [arg: string, ...options?: any[]];`
 *             Callable<funcParams, OtherType>
 * - Usage:
 *    type CallableFunction = Callable<null, string>;
 *    const myFunc : CallableFunction = () : string => {
 *      return 'string';
 *    }
 */
type Callable<P = any, V = any> = P extends never | null | undefined ? () => V : P extends any[] ? (...args: P) => V : P extends any ? ((arg: P) => V) | ((arg?: P) => V) : unknown;
/**
 * Constructable<Parameters, ReturnType>
 * - Used for defining signatature of a constructable function: parameters and return type.
 * - Use tuple types for variadic signatures
 *   example: `type funcParams = [arg: string, ...options?: any[]];`
 *             Constructable<funcParams, OtherType>
 * - Usage:
 *    type ConstructableFunction = Constructable<null, string>;
 *    const myFunc : ConstructableFunction = function() : string => {
 *      return 'string';
 *    }
 */
type Constructable<P = any, V = any> = P extends never | null | undefined ? new () => V : P extends any[] ? new (...args: P) => V : P extends any ? new (arg: P) => V : unknown;
/**
 * Convience types, combination of arrow/constructor and (a)sync.
 * All other type use Callable or Constructable directly.
 *
 * ArrowFunction:
 *  - Synchronous arrow functions
 * AsyncArrowFunction:
 *  - Asynchronous arrow functions
 * ConstructorFunction:
 *  - Same as sync ArrowFunction except must be constructed ie: `function() {}` or `class {}`
 * AsyncConstructorFunction:
 *  - Same as sync ConstructorFunction except Promise<R> as return type.
 *  - Either `function() : Promise<R> {}` or the class constructor or method returns a promise.
 */
type ArrowFunction = Callable<null, any> | Callable<any, any> | Callable<any[], any>;
type ConstructorFunction = Constructable<null, any> | Constructable<any, any> | Constructable<any[], any>;
type CompareFunction<A, B = A> = Callable<any[], number> | Callable<[A, B], number>;
type State<T extends Json = Json> = {
    revisionId: string;
    value: T;
};
type Action<T = any> = {
    type: string;
    data?: T;
} & AnyObject;

/**
 * @module middleware
 * Description: Generic middleware system
 * - A simple curried middleware API inspired by Redux (apply() => compose() => middleware)
 *   which is a combination of the compose and apply combinators.
 * - Not intended to be general purpose function combinators but rather a system for embedding middleware
 * - Main usage is `applyMiddleware(...middleware) => createApi => api`
 *
 * NOTE: Generic structure for types may change in future versions
 */

/**
 * Name: passthroughCreateApi
 * Description: Default passthrough createApi function.
 *  Creates resultant object with the middleware() method
 * @param api
 * @returns object of middleware APO
 */
declare const passthroughCreateApi: (api?: any | any[]) => any;
/**
 * Name: passthroughMiddleware
 * Description: Default passthrough middleware.
 * @param
 * @returns Default middleware for chain
 */
declare const passthroughMiddleware: (_: unknown) => (middleware: Callable<any[], any>) => (...params: any[]) => any;
/**
 * Name: passthroughSort
 * Description: Default passthrough sort. A 'noop' sort. Ignores params for sort and returns '0'
 * @returns 0 for compare function
 */
declare const passthroughSort: (..._: any[]) => number;
/**
 * Name: passthroughTransform
 * Description: Default passthrough transform for the createMiddleware reducer
 * @param acc Array<any>
 * @param cm TransformMiddleware<T, R>
 * @returns Middleware<T, R>[]
 */
declare const passthroughTransform: <T = any, R = any>(acc: any[], tm: TransformMiddleware<T, R>) => any[];
/**
 * Middleware types
 * NOTE: These will be refactored in the future. Do not use these directly right now.
 */
type ApiFactory<T = any, R = any> = Callable<T[], ApiRecord<T, R>>;
interface ApiRecord<T = any, R = any> extends AnyObject {
    middleware(args: T): R;
    middleware(...args: any[]): R;
}
type AppliedMiddlewareFactory<T = any, R = any> = Callable<ApiFactory<T, R>, ApiFactory<T, R>>;
type Middleware<T = any, R = any> = (api: ApiRecord<T, R> | Middleware<T, R>) => UncurriedMiddleware<T, R>;
type MiddlewareParams<T = any, R = any, A = any, B = A> = {
    createApi?: ApiFactory<T, R>;
    middleware?: TransformMiddleware<T, R>[];
    sort?: CompareFunction<A, B>;
    transform?: Callable<any[], any>;
};
type TransformMiddleware<T = any, R = any> = {
    data?: AnyObject;
    middleware: Middleware<T, R>;
} & AnyObject;
type UncurriedMiddleware<T = any, R = any> = Callable<Middleware<T, R>, ArrowFunction>;
/**
 * Name: compose
 * Description: B/compose combinator. Compose combinator speciffically designed
 *  to handle Middleware (not general purpose).
 * @public
 * @template M - Middleware type
 * @param middlewares
 * @returns ArrowFunction of chained middleware
 */
declare function compose$1<M extends Middleware>(...middlewares: M[]): ArrowFunction;
/**
 * Name: applyMiddleware
 * Description: Apply/A combinator. Apply combinator and main entry point for creating miuddleware
 * @public
 * @template T, R - T: parameter type, R: return type
 * @param middlewares Array of middleware
 * @returns AppliedMiddlewareFactory<T, R>
 */
declare function applyMiddleware<T = any, R = any>(...middlewares: Middleware<T, R>[]): AppliedMiddlewareFactory<T, R>;
/**
 * Name: CreateMiddlewareParams
 * Description:
 * @private
 * @template T, R, A, B - T: parameter type, R: return type, A,B: compare subjects
 * @typedef {ApiFactory} createApi
 * @typedef {TransformMiddleware} middleware
 * @typedef {CompareFunction} sort
 * @typedef {ReduceFunction} transform
 */
type CreateMiddlewareParams<T = any, R = any, A extends TransformMiddleware<T, R> = TransformMiddleware<T, R>, B extends TransformMiddleware<T, R> = A> = {
    createApi?: ApiFactory<T, R>;
    middleware?: TransformMiddleware<T, R>[];
    sort?: CompareFunction<A, B>;
    transform?: ReduceFunction<any[], TransformMiddleware<T, R>, any[], Middleware<T, R>[]>;
};
/**
 * Name: createMiddleware
 * Description: Main middleware API constructor
 * - Convenience factory for creating tranformable middleware APIs
 * - Provides sort and transform configurable modifier callbacks
 * - Caveat is that Middleware[] must be an array of objects containing
 *   at least: [{ middleware }, ...]
 * @public
 * @template T, R, A, B - T: parameter type, R: return type, A,B: compare subjects
 * @param params CreateMiddlewareParams<T, R, A, B>
 * @returns (...args: T[]) => ApiRecord<T, R>
 */
declare const createMiddlewareApi: <T = any, R = any, A extends TransformMiddleware<T, R> = TransformMiddleware<T, R>, B extends TransformMiddleware<T, R> = A>(params?: CreateMiddlewareParams<T, R, A, B>) => (...args: T[]) => ApiRecord<T, R>;

/**
 * @module cache
 * Description: A key-value data storage and retrieval framework
 */

/**
 * Name:  Cache
 * Description:  API interface for Cache implementations
 * @public
 * @interface {Cache<K, V>}
 */
interface Cache<K, V> {
    clear: () => void;
    length: number;
    getValue: (key: K) => Readonly<V>;
    hasValue: (key: K) => boolean;
    name: Readonly<string>;
    removeValue: (key: K) => boolean;
    setValue: (key: K, value: V) => void;
}
/**
 * Name: CACHE_ACTIONS
 * Description: Cache actions to be used for reducers or similar
 * @public
 * @readonly
 * @enum {string}
 */
declare enum CACHE_ACTIONS {
    CACHE_CLEAR = "CACHE_CLEAR",
    CACHE_GET_VALUE = "CACHE_GET_VALUE",
    CACHE_HAS_VALUE = "CACHE_HAS_VALUE",
    CACHE_LENGTH = "CACHE_LENGTH",
    CACHE_REMOVE_VALUE = "CACHE_REMOVE_VALUE",
    CACHE_SET_VALUE = "CACHE_SET_VALUE"
}
/**
 * Name: MapCacheParams
 * Description: MapCache params
 * @private
 * @typedef {Object}
 * @property {string} name - Cache name
 */
type MapCacheParams = {
    name?: string;
};
/**
 * Name:  MapCache
 * Classdesc: Default cache implementation
 * @public
 * @class
 * Implements: {Cache<K, V>}
 */
declare class MapCache<K = MapHashKey, V = any> implements Cache<K, V> {
    private cache;
    private cacheName;
    constructor(params?: MapCacheParams);
    get length(): number;
    hasValue(key: K): boolean;
    get name(): string;
    setValue(key: K, value: V): void;
    getValue(key: K): V;
    removeValue(key: K): boolean;
    clear(): void;
}
/**
 * Function:
 * Name:  createMapCache
 * Description: MapCache implementation with middleware support
 * Implements: {Cache<K, V>}
 * @param params MapCacheParams & MiddlewareParams<AnyObject, any>
 * @returns Cache<K, V> interface
 */
declare function createMapCache<K = MapHashKey, V = any>(params?: MapCacheParams & MiddlewareParams): Cache<K, V>;

/**
 * @module combinators
 * Functional Combinator lib
 * based off of https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45
 * Future versions will include practical examples where applicable.
 * NOTE: Not complete and a WIP
 * @todo Complete, streamline and integrate into other modules
 * Description: Common functional combinators
 */

/**
 * Function:
 * @public
 * Name: noop
 * Description: Noop/N "null" or 0 combinator. Used for needing a function placeholder
 * @returns undefined
 */
declare function noop(..._: any[]): void;
declare const N: typeof noop;
/**
 * Function:
 * @public
 * Name: identity
 * Description: Identity/I combinator
 * @param x: T
 * @returns x: T
 */
declare const identity: <T = any>(x?: T) => T;
declare const I: <T = any>(x?: T) => T;
/**
 * Function:
 * @public
 * Name: constant
 * Description: Constant/K combinator
 * @param x: T
 * @returns () => x: T
 */
declare const constant: <T = any>(x: T) => (..._: any[]) => T;
declare const K: <T = any>(x: T) => (..._: any[]) => T;
/**
 * Function:
 * @public
 * Name: apply
 * Description: Apply/A combinator
 * @param
 * @returns
 */
declare const apply: <T = any>(f: ArrowFunction) => (x: T) => any;
declare const A: <T = any>(f: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: thrush
 * Description: Thrush/T combinator
 * @param
 * @returns
 */
declare const thrush: <T = any>(x: T) => (f: ArrowFunction) => any;
declare const T: <T = any>(x: T) => (f: ArrowFunction) => any;
/**
 * Function:
 * @public
 * Name: duplication
 * Description: Duplication/W combinator
 * @param
 * @returns
 */
declare const duplication: <T = any>(f: ArrowFunction) => (x: T) => any;
declare const W: <T = any>(f: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: flip
 * Description: flip/C combinator
 * @param
 * @returns
 */
declare const flip: <T = any, U = any>(f: ArrowFunction) => (y: U) => (x: T) => any;
declare const C: <T = any, U = any>(f: ArrowFunction) => (y: U) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: compose
 * Description: Compose/B combinator
 * @param
 * @returns
 */
declare const compose: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
declare const B: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: substitution
 * Description: Substitution/S combinator
 * @param
 * @returns
 */
declare const substitution: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
declare const S: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: chain
 * Description: chain/S_ combinator
 * @param
 * @returns
 */
declare const chain: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
declare const S_: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: converge
 * Description: converge/S2 combinator
 * @param
 * @returns
 */
declare const converge: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (h: ArrowFunction) => (x: T) => any;
declare const S2: <T = any>(f: ArrowFunction) => (g: ArrowFunction) => (h: ArrowFunction) => (x: T) => any;
/**
 * Function:
 * @public
 * Name: psi
 * Description: Psi/P combinator
 * @param
 * @returns
 */
declare const psi: <T = any, U = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => (y: U) => any;
declare const P: <T = any, U = any>(f: ArrowFunction) => (g: ArrowFunction) => (x: T) => (y: U) => any;
/**
 * Function:
 * @public
 * Name: FixPoint
 * Description: FixPoint/Y combinator
 * @param
 * @returns
 */
declare const fixPoint: <T = any>(f: ArrowFunction) => any;
declare const Y: <T = any>(f: ArrowFunction) => any;

declare const index_noop: typeof noop;
declare const index_N: typeof N;
declare const index_identity: typeof identity;
declare const index_I: typeof I;
declare const index_constant: typeof constant;
declare const index_K: typeof K;
declare const index_apply: typeof apply;
declare const index_A: typeof A;
declare const index_thrush: typeof thrush;
declare const index_T: typeof T;
declare const index_duplication: typeof duplication;
declare const index_W: typeof W;
declare const index_flip: typeof flip;
declare const index_C: typeof C;
declare const index_compose: typeof compose;
declare const index_B: typeof B;
declare const index_substitution: typeof substitution;
declare const index_S: typeof S;
declare const index_chain: typeof chain;
declare const index_S_: typeof S_;
declare const index_converge: typeof converge;
declare const index_S2: typeof S2;
declare const index_psi: typeof psi;
declare const index_P: typeof P;
declare const index_fixPoint: typeof fixPoint;
declare const index_Y: typeof Y;
declare namespace index {
  export {
    index_noop as noop,
    index_N as N,
    index_identity as identity,
    index_I as I,
    index_constant as constant,
    index_K as K,
    index_apply as apply,
    index_A as A,
    index_thrush as thrush,
    index_T as T,
    index_duplication as duplication,
    index_W as W,
    index_flip as flip,
    index_C as C,
    index_compose as compose,
    index_B as B,
    index_substitution as substitution,
    index_S as S,
    index_chain as chain,
    index_S_ as S_,
    index_converge as converge,
    index_S2 as S2,
    index_psi as psi,
    index_P as P,
    index_fixPoint as fixPoint,
    index_Y as Y,
  };
}

/**
 * Name: Decorator<T, V, R>
 * Description: Superset Decorator type
 * @public
 * @template T, V, R - T: target type, V: TypedPropertyDescriptor value, R: return type
 * @typedef {Function} Decorator<T, V, R>
 */
type Decorator<T extends Callable | Constructable, V = any, R extends DecoratorReturnType<V> = DecoratorReturnType<V>> = Callable<[
    target: T,
    propertyKey?: string | symbol,
    optionalParam?: number | PropertyDescriptor | TypedPropertyDescriptor<V>
], R>;
/**
 * Name: DecoratorCallback<T, V>
 * Description:
 * @public
 * @template T, V - T: target type, V: TypedPropertyDescriptor value
 * @typedef {Function} DecoratorCallback<T, V>
 */
type DecoratorCallback<T, V, R = any> = Callable<DecoratorCallbackParams<T, V>, R>;
/**
 * Name: DecoratorCallbackParams<T, V>
 * Description: Superset Decorator type
 * @public
 * @template T, V - T: target type, V: TypedPropertyDescriptor value
 * @typedef {Object} DecoratorCallbackParams<T, V>
 * @property {any} target - Target type
 * @property {string | symbol} propertyKey - Name of the property key
 * @property {PropertyDescriptor | TypedPropertyDescriptor<V>} descriptor - Decorator descriptor
 * @property {number} parameterIndex - 0-index number parameter order
 * @property {Function} api - Middleware API interface
 */
type DecoratorCallbackParams<T, V> = {
    target: T;
    propertyKey?: string | symbol;
    descriptor?: PropertyDescriptor | TypedPropertyDescriptor<V>;
    parameterIndex?: number;
    api?: Callable<any[], ApiRecord>;
};
/**
 * Name: DecoratorReturnType
 * Description: Pattern matching type for all possible return types for a decorator
 * @public
 * @template V - TypedPropertyDescriptor value
 * @typedef {void | Callable | Constructable | typeof Function | PropertyDescriptor | TypedPropertyDescriptor<D>} - creates a union type: 'DecoratorReturnType'
 */
type DecoratorReturnType<V = any> = void | Callable | Constructable | typeof Function | PropertyDescriptor | TypedPropertyDescriptor<V>;
/**
 * Name: CreateDecoratorParams<T, V>
 * Description: Parameters for createDecorator
 * @private
 * @template T, V - T: target type, V: TypedPropertyDescriptor value
 * @typedef {Object} CreateDecoratorParams<T, V>
 * @property {Function} callback - DecoratorCallback<T, V> handler
 */
type CreateDecoratorParams<T, V> = {
    callback: DecoratorCallback<T, V>;
} & MiddlewareParams;
/**
 * Name: createDecorator<T, V, R>
 * Description: Generic decorator factory
 * @public
 * @template T, V, R - T: target type, V: TypedPropertyDescriptor value, R: return type
 * @param params - CreateDecoratorParams<T, V>
 * @returns Decorator<T, V, R>
 */
declare const createDecorator: <T extends ArrowFunction | ConstructorFunction, V = any, R extends DecoratorReturnType<V> = DecoratorReturnType<V>>(params: CreateDecoratorParams<T, V>) => Decorator<T, V, R>;
/**
 * Decorator factories
 */
/**
 * Name: createClassDecorator<T, V, R>
 * Description: Class (top level constructor) decorator factory
 * @public
 * @param params CreateDecoratorParams<T, V>
 * @returns Decorator<T, V, R>
 */
declare const createClassDecorator: <T extends ConstructorFunction = ConstructorFunction, V = any, R extends DecoratorReturnType<V> = void | FunctionConstructor>(params: CreateDecoratorParams<T, V>) => (target: T, propertyKey?: string | symbol, optionalParam?: number | PropertyDescriptor | TypedPropertyDescriptor<V>) => R;
/**
 * Name: createClassMemberDecorator<T, V, R>
 * Description: Class Member (inner level) decorator factory
 * @public
 * @param params CreateDecoratorParams<T, V>
 * @returns Decorator<T, V, R>
 */
declare const createClassMemberDecorator: <T extends ConstructorFunction = ConstructorFunction, V = any, R extends DecoratorReturnType<() => void> = void | PropertyDescriptor | TypedPropertyDescriptor<() => void>>(params: CreateDecoratorParams<T, V>) => any;
/**
 * Handler factories
 * - Handles updates for Class and Class members
 * - Slimplified factories without middleware support
 * - To be used in decorator callbacks to streamline decorator handling
 * - Main focus is accessor/descriptor updates
 */
/**
 * Name: createClassHandler
 * Description: Class (top level constructor) decorator handler
 * @public
 * @param params calllback for handler
 * @returns Class decorator (target) => void
 */
declare const createClassHandler: (callback: Callable<any[], void>) => (target: ConstructorFunction) => void;
/**
 * Class Method Handler
 * - Only descriptors can be updated.
 * - See: https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators
 *
 * Name: createClassMethodHandler
 * Description: Class method (inner level) decorator handler
 * @public
 * @param params calllback: callback for handler, newDescriptor: descriptor override
 * @returns Class method decorator (target, propertyKey, descriptor) => void
 */
declare const createClassMethodHandler: <V = any>({ callback, newDescriptor, }: {
    callback?: Callable<any[], void>;
    newDescriptor: PropertyDescriptor | TypedPropertyDescriptor<V>;
}) => (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor | TypedPropertyDescriptor<V>) => void;
/**
 * Class Method Parameter Handler
 * https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators
 *
 * Name: createClassParameterHandler
 * Description: Class parameter (inner level) decorator handler
 * @public
 * @param params calllback: callback for handler
 * @returns Class parameter decorator (target, propertyKey, parameterIndex) => void
 */
declare const createClassParameterHandler: (callback?: Callable<any[], void>) => (target: AnyObject, propertyKey: string | symbol, parameterIndex: number) => void;
/**
 * Class Accessor/Property Handler
 * - Property get and set can be changed.
 * - See: https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 * - NOTE: For property decorators to work, you must either use the 'declare' keyword or
 *         'useDefineForClassFields' must be set to false in tsconfig.json.
 *         https://github.com/microsoft/TypeScript/issues/35081
 *
 *         Example:
 *
 *         `class Test {
 *           @Decorator
 *           declare prop: string;
 *         }`
 *
 * Name: createClassPropertyHandler
 * Description: Class Member (inner level) decorator handler
 * @public
 * @param params calllback: callback for handler, accessors: accessor override
 * @returns Class member decorator (target, propertyKey) => void
 */
declare const createClassPropertyHandler: ({ callback, accessors, }: {
    callback?: Callable<any[], void>;
    accessors?: {
        get?: Callable<null, any>;
        set?: Callable<any, void>;
    };
}) => (target: any, propertyKey: string | symbol) => void;

/**
 * @module httpclient
 * Description: Generic async HTTP client with middleware support for Request and Response handling.
 **/

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body
 * Name: RequestBody
 * Description: Union type covering all possible RequestBody types.
 * @public
 * @typedef {ArrayBuffer | Blob | BodyInit | DataView | FormData | string | TypedArray | URLSearchParams} RequestBody
 */
type RequestBody = ArrayBuffer | Blob | BodyInit | DataView | FormData | string | TypedArray | URLSearchParams;
/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Priority
 * Name: RequestPriority
 * Description: Union type covering all possible RequestBody types for use with the RequestInit.
 * @public
 * @typedef {'auto' | 'high' | 'low'} RequestPriority
 */
type RequestPriority = 'auto' | 'high' | 'low';
/**
 * https://datatracker.ietf.org/doc/html/rfc2616#section-5.1.1
 * Name: HTTPMethods
 * Description: Methods supported by XMLHttpRequest or fetch.
 * @public
 * @enum {string}
 */
declare enum HTTPMethods {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE"
}
/**
 * https://datatracker.ietf.org/doc/html/rfc2616#section-5.1.1
 * Name: HTTPMethodValues
 * Description: Methods supported by XMLHttpRequest or fetch.
 * @public
 * @typedef {string} - Union type of HTTPMethods string values
 */
type HTTPMethodValues = `${HTTPMethods}`;
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Attribution_Reporting_API
 * Name: AttributionReportingOptions
 * Description: Options for attributionReporting. Experimental and might be removed.
 * @public
 * @typedef {Object} AttributionReportingOptions
 * @property {boolean} eventsourceeligible
 * @property {boolean} triggereligible
 */
type AttributionReportingOptions = {
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
type RequestInit = {
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
type FetchParams = [
    request: Request | string | URL,
    requestInitOptions?: RequestInit
];
/**
 * Name: HTTPCLIENT_ACTIONS
 * Description: HttpClient actions to be used for middleware or similar
 * @public
 * @readonly
 * @enum {string}
 */
declare enum HTTPCLIENT_ACTIONS {
    HTTP_REQUEST = "HTTP_REQUEST",
    HTTP_RESPONSE = "HTTP_RESPONSE"
}
/**
 * Name: HttpClientParams
 * Description: Params type for HttpClient
 * @public
 * @typedef {Object} HttpClientParams
 * @property {Request | URL | string} request
 * @property {RequestInit} options
 */
type HttpClientParams = {
    abortControllerOptions?: {
        reason?: string;
        timeout?: number;
    };
    middlewareOptions?: AnyObject;
    requestInitOptions?: RequestInit;
    request: Request | string | URL;
};
/**
 * Name: HttpClient
 * Description: fetch request factory with request and response middleware support
 * Function:
 * @public
 * @param defaultParams HttpClientParams
 * @returns {(requestInit?: RequestInit): Promise<R>}  async http client
 */
declare function HttpClient<R = any>(defaultParams: HttpClientParams & MiddlewareParams): (requestInit?: RequestInit) => Promise<R>;
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
declare function clientFactory(method: HTTPMethods, defaultParams: HttpClientParams & MiddlewareParams): (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
/**
 * Name: createHttpClient
 * Description: Per path/resource HttpClient factory
 * Function:
 * @public
 * @param defaultParams HttpClientParams
 * @returns {Object} HTTP method factories based of default params
 */
declare function createHttpClient(defaultParams: HttpClientParams & MiddlewareParams): {
    connect: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    delete: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    get: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    head: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    options: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    patch: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    post: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    put: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
    trace: (params?: HttpClientParams) => Promise<(requestInit?: RequestInit) => Promise<any>>;
};

/**
 * @module logger
 * Description: Generic logging API with middleware support
 */

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/console
 * Description: Console interface. Deprecated and experimental functions are excluded
 * @public
 * @typedef {Object} Console
 */
type Console = {
    assert: Callable<any[], void>;
    clear: Callable<any[], void>;
    count: Callable<any[], void>;
    countReset: Callable<any[], void>;
    debug: Callable<any[], void>;
    dir: Callable<any[], void>;
    dirxml: Callable<any[], void>;
    error: Callable<any[], void>;
    fatal: Callable<any[], void>;
    group: Callable<any[], void>;
    groupCollapsed: Callable<any[], void>;
    groupEnd: Callable<any[], void>;
    info: Callable<any[], void>;
    log: Callable<any[], void>;
    table: Callable<any[], void>;
    time: Callable<any[], void>;
    timeEnd: Callable<any[], void>;
    timeLog: Callable<any[], void>;
    trace: Callable<any[], void>;
    warn: Callable<any[], void>;
};
/**
 * Name: LineOptions
 * Description: Line options used for logging lines through the API
 *  The `formatter` is used to create, most likely, a string.
 *  The `level` sets the severity
 *  The `prefix` identifies what is logging
 *  The `timeStamp` represents the timestamp of the loglne
 * @public
 * @template F - F: log line format
 * @typedef {Object} LineOptions<F>
 * @property {typeof Function} formatter
 * @property {LogLevel} level
 * @property {string} prefix
 */
type LineOptions<F = string> = {
    formatter: Callable<any[], F>;
    level: LogLevel;
    prefix: string;
    timeStamp: {
        raw: Date;
        formatted: string;
    };
};
/**
 * Description: Logger API type definition
 * @public
 * @template F - F: log line format
 * @typedef {Object} Logger<F>
 * @property {typeof Function} log
 * @property {typeof Function} updateOptions
 */
type Logger<F = string> = {
    log: (...args: any[]) => void;
    updateOptions: (params: LoggerParams<F>) => void;
};
/**
 * Name: LOGGER_ACTIONS
 * Description: Logger API actions
 * @public
 * @readonly
 * @enum {string}
 */
declare enum LOGGER_ACTIONS {
    LOGGER_CREATE_LINE = "LOGGER_CREATE_LINE",
    LOGGER_LOG_LINE = "LOGGER_LOG_LINE"
}
/**
 * Name: LogLevel
 * Description: LogLevel type definition
 * @public
 * @typedef {'debug' | 'info' | 'warn' | 'error' | 'fatal'} string
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
/**
 * Name: LoggerParams<F>
 * Description: params for `createLogger<F>`
 * @private
 * @template F - F: log line format
 * @typedef {typeof Function} formatter
 * @typedef {LogLevel} level
 * @typedef {AnyObject} middlewareOptions
 * @typedef {string} prefix
 * @typedef {Console} output
 */
type LoggerParams<F = string> = {
    formatter?: Callable<any, F>;
    level?: LogLevel;
    middlewareOptions?: AnyObject;
    prefix?: string;
    output?: Console | Callable<any, F>;
};
/**
 * Name: LogRecord<T>
 * Description: params for `createLogger<F>`
 * @public
 * @template F - F: log line format
 * @typedef {AnyObject} raw
 * @typedef {T} formatted
 */
type LogRecord<T = string> = {
    raw: AnyObject;
    formatted?: T;
};
/**
 * Name: createLogger<F>
 * Description: Creates a middleware enabled Logger
 * @public
 * @template F - F: log line format
 * @param params LoggerParams<F> & MiddlewareParams
 * @returns Logger<F>
 */
declare const createLogger: <F = string>(params?: LoggerParams<F> & MiddlewareParams) => Logger<F>;

/**
 * @module matcher
 * Description: Validation framework which can be used for testing matchers,
 *  input valiation, or similar use cases
 */

/**
 * Name: MATCHER_ACTIONS
 * Description: Matcher actions for middleware
 * @public
 * @readonly
 * @enum {string}
 */
declare enum MATCHER_ACTIONS {
    MATCH = "MATCH"
}
/**
 * Name: CreateMatchParams
 * Description: options to pass to matcher middleware
 * @private
 * @typedef {AnyObject} options object
 */
type CreateMatchParams = {
    options?: AnyObject;
};
/**
 * Name: CreateMatchParams
 * Description: options to pass to matcher middleware
 * @public
 * @template A, B - types for subjects to be compared
 * @param params Middleware options for matcher
 * @returns Callable<[A, B], boolean>
 */
declare const createMatcher: <A = any, B = A>(params?: CreateMatchParams & MiddlewareParams) => Callable<[A, B], boolean>;
/**
 * Description: Proxied matcher
 * - Used for writing validations that have more natural language validators
 * - Inspired by ChaiJS
 * - Can be used for assertion or input validators etc
 * - ex:
 *   const validator = createProxiedMatcher(options);
 *   validator.match(actual.a, actual.b)
 *   validator.expect(actual).to.customEvaluator()
 * @public
 * @template H, P, R - H: Target Handler type, P: property type, R: receiver type
 * @param defaultHandler
 * @param options
 * @returns
 */
declare const createMatcherProxyHandler: <H extends AnyObject = AnyObject<any>, P extends string | symbol = string | symbol, R = any>(defaultHandler?: AnyObject, options?: AnyObject) => ProxyHandler<H>;
/**
 * Name: ProxiedMatcherParams
 * Description: options to pass to matcher middleware
 * @private
 * @typedef {object}
 * @property {AnyObject} defaultHandler object
 * @property {AnyObject} defaultTarget object
 * @property {string} methodName match method name
 */
type ProxiedMatcherParams = {
    defaultHandler?: AnyObject;
    defaultTarget?: AnyObject;
    methodName?: string;
};
/**
 * Name: createProxiedMatcher
 * Description: The `createProxiedMatcher<A, B>` allows for a flexible micro-assertion library
 *  extendable via middleware. This throws for any failure.
 * @public
 * @template A, B - A: first subject, B: second subject
 * @param params Hander, Target, and middleware options
 * @returns ProxyHandler<AnyObject>
 */
declare const createProxiedMatcher: <A = any, B = A>(params?: ProxiedMatcherParams & MiddlewareParams) => ProxyHandler<AnyObject>;
/**
 * Name: createProxiedMatcher
 * Description: The `createProxiedMatcher<A, B>` allows for a flexible micro-assertion library
 *  extendable via middleware. This throws for any failure.
 * @public
 * @template A, B - A: first subject, B: second subject
 * @param params Hander, Target, and middleware options
 * @returns ProxyHandler<AnyObject>
 */
/**
 * Name: createProxiedMatchTarget
 * Description: Creates target for proxied/chainable matcher
 * @public
 * @param target AnyObject
 * @returns AnyObject
 */
declare const createProxiedMatchTarget: (target: AnyObject) => AnyObject;

/**
 * @module react/loader
 * Description: Convenience React root component mounter
 */

/**
 * Name: RenderFunc
 * Description: Logger API type definition
 * @private
 * @typedef {typeof Function} RenderFunc
 */
type RenderFunc = Callable<RenderFuncParams, void>;
/**
 * Description: Logger API type definition
 * @public
 * @template F - F: log line format
 * @typedef {Object}
 * @property {typeof Function} log
 * @property {typeof Function} updateOptions
 */
type RenderFuncParams = {
    Component: ReactNode;
    rootElement: RootElement;
};
type RootElement = Element | DocumentFragment | string;
type MountRootComponentParams = {
    logger?: Callable<any[], void>;
    renderFunc?: RenderFunc;
} & RenderFuncParams;
/**
 * Universal loader for Component root
 * @param Comp
 * @param rootElement
 */
declare const mountRootComponent: (params: MountRootComponentParams) => boolean;

/**
 * @module reducer/history
 * Description: History and HistoryController APIs
 */

/**
 * Name: History
 * Description: History object
 * @public
 * @typedef {Object}
 * @property {S[]} past
 * @property {undefined | S} current
 * @property {S[]} future
 */
type History<T extends Json = Json, S extends State<T> = State<T>> = {
    past: Array<S>;
    current: undefined | S;
    future: Array<S>;
};
/**
 * Name: HistoryController
 * Description: History Controller object
 * @public
 * @template T, S
 * @typedef {Object}
 */
type HistoryController<T extends Json = Json, S extends State<T> = State<T>> = {
    clear: () => void;
    getHistory: () => Readonly<History<T, S>>;
    getState: () => Readonly<S>;
    jumpToFutureRevision: (revisionId: string) => void | Readonly<S>;
    jumpToPastRevision: (revisionId: string) => void | Readonly<S>;
    jumpToRevision: (revisionId: string) => void | Readonly<S>;
    redo: (steps?: number) => Readonly<S>;
    setState: (value: T) => Readonly<S>;
    undo: (steps?: number) => Readonly<S>;
};
/**
 * Name: HistoryParams
 * Description: HistoryParams object
 * @private
 * @template T, S
 * @typedef {Object}
 */
type HistoryParams<T extends Json = Json, S extends State<T> = State<T>> = {
    current?: S;
    future?: S[];
    past?: S[];
};
declare function createHistory<T extends Json = Json, S extends State<T> = State<T>>(params?: HistoryParams<T, S>): History<T, S>;
/**
 * Name: CreateHistoryControllerParams
 * Description: CreateHistoryControllerParams object
 * @private
 * @template T, S
 * @typedef {Object}
 */
type CreateHistoryControllerParams<T extends Json = Json, S extends State<T> = State<T>> = {
    idFactory?: Callable<any[], string>;
    history?: History<T, S>;
    limit?: number;
};
/**
 * Name: createHistoryController
 * Description: Constructor for creating a new HistoryController
 * @public
 * @template T, S
 * @param params
 * @returns HistoryController<T, S>
 */
declare function createHistoryController<T extends Json = Json, S extends State<T> = State<T>>(params?: CreateHistoryControllerParams<T, S>): HistoryController<T, S>;

/**
 * @module reducer/reducer
 * Description: Reducer, ReducerAction APIs
 */

/**
 * Name: Reducer
 * Description: Reducer API object
 * @public
 * @typedef {Object}
 */
type Reducer<T extends Json = Json, S extends State<T> = State<T>> = {
    dispatch: (state: S, action: Action<T>) => S;
    getAction: (name: string | symbol) => ReducerAction<T, S>;
    getAllActions: () => Record<string | symbol, ReducerAction<T, S>>;
    hasAction: (name: string | symbol) => boolean;
    name: string;
    removeAction: (name: string | symbol) => void;
    removeAllActions: () => void;
    setAction: (name: string | symbol, action: ReducerAction<T, S>) => void;
    setActions: (actions: Record<string | symbol, ReducerAction<T, S>>) => void;
};
/**
 * Name: ReducerAction
 * Description: ReducerAction API object
 * @public
 * @typedef {Object}
 */
type ReducerAction<T extends Json = Json, S extends State<T> = State<T>, A extends Action<T> = Action<T>> = Callable<[state: S, action?: A], S>;
/**
 * Name: ReducerCollection
 * Description: ReducerCollection object
 * @public
 * @typedef {Object}
 */
type ReducerCollection<T extends Json = Json, S extends State<T> = State<T>> = Record<string | symbol, ReducerAction<T, S>>;
/**
 * Name: CreateReducerParams
 * Description: CreateReducerParams params object
 * @private
 * @typedef {Object}
 */
type CreateReducerParams<T extends Json = Json, S extends State<T> = State<T>> = {
    name?: string;
    actions?: ReducerCollection<T, S>;
};
/**
 * Name: createReducer
 * Description: createReducer API constructor
 * @public
 * @template T, S
 * @param params CreateReducerParams<T, S>
 * @returns Reducer<T, S>
 */
declare const createReducer: <T extends Json = Json, S extends State<T> = State<T>>(params?: CreateReducerParams<T, S>) => Reducer<T, S>;

/**
 * @module reducer/store
 * Description: The main reducer API entrypaint
 */

/**
 * Name: Store
 * Description: Store API object
 * @public
 * @typedef {Object}
 */
type Store<T extends Json = Json, S extends State<T> = State<T>, A extends Action<T> = Action<T>> = {
    actions: ReducerCollection<T, S>;
    dispatch: Callable<A, void>;
    getState: Callable<null, S>;
    name: string;
    subscribe: Callable<ArrowFunction, Callable<null, void>>;
};
/**
 * Name: STORE_ACTIONS
 * Description: Store actions to be used for reducers or similar
 * @public
 * @readonly
 * @enum {string}
 */
declare enum STORE_ACTIONS {
    DISPATCH_ACTION = "@DISPATCH_ACTION",
    SUBSCRIBE = "@SUBSCRIBE",
    UNSUBSCRIBE = "@UNSUBSCRIBE",
    CLEAR = "@CLEAR",
    JUMP_TO_FUTURE_REVISION = "@JUMP_TO_FUTURE_REVISION",
    JUMP_TO_PAST_REVISION = "@JUMP_TO_PAST_REVISION",
    JUMP_TO_REVISION = "@JUMP_TO_REVISION",
    REDO = "@REDO",
    UNDO = "@UNDO"
}
/**
 * Name: StoreParams
 * Description: StoreParams params object
 * @private
 * @typedef {Object}
 */
type StoreParams<T extends Json = Json, S extends State<T> = State<T>> = {
    historyCtl?: HistoryController<T, S>;
    name?: string;
    options?: AnyObject;
    reducers: Record<string | symbol, ReducerCollection<T, S>>;
};
/**
 * Name: createStore
 * Description: createStore API constructor
 * @public
 * @template T, S
 * @param params StoreParams<T, S> & MiddlewareParams
 * @returns Store<T, S>
 */
declare const createStore: <T extends Json = Json, S extends State<T> = State<T>>(params: StoreParams<T, S> & MiddlewareParams) => Store<T, S>;

/**
 * @module resource
 * Description: Dynamically create Resources with managed URIs
 * https://www.iana.org/assignments/media-types/media-types.xhtml
 */

/**
 * Name: GlobalResource
 * Description: The object representing resources globally
 * @public
 * @typedoc {Object}
 */
type GlobalResource = {
    controller: string | symbol;
    name: string | symbol;
    url: string;
};
/**
 * Name: Resource
 * Description: The Resource API object
 * @public
 * @template T
 * @typedoc {Object}
 */
type Resource<T = any> = {
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
interface CreateResourceParams<T = any> extends AnyObject {
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
declare class ResourceController {
    private static globalResources;
    private static controllerNames;
    private static create;
    private static delete;
    private static get;
    private static update;
    static list(): Readonly<AnyObject>;
    /**
     * Ensures strings do not contain a colon `:` in them.
     * @param str
     * @returns
     */
    static validateIdString(str: string): boolean;
    private controllerName;
    private controllerResources;
    private names;
    constructor(name: string | symbol);
    /**
     * Name: name
     * Description: lists name
     * @public
     * @returns Readonly<string>
     */
    get name(): Readonly<string>;
    /**
     * Name: resources
     * Description: lists resources
     * @public
     * @returns Readonly<Record<string, Resource>>
     */
    get resources(): Readonly<Record<string, Resource>>;
    /**
     * Name: create
     * Description: create resource
     * @public
     * @param params CreateResourceParams<T>
     * @returns void | Readonly<Resource<T>>
     */
    create<T = any>(params: CreateResourceParams<T>): void | Readonly<Resource<T>>;
    /**
     * Name: delete
     * Description: delete resource by name
     * @public
     * @param params name
     * @returns boolean
     */
    delete(name: string | symbol): boolean;
    /**
     * Name: get
     * Description: gets resource by name
     * @public
     * @param params name
     * @returns void | Readonly<Resource<T>>
     */
    get(name: string | symbol): void | Readonly<Resource>;
    /**
     * Name: update
     * Description: updates resource by name
     * @public
     * @param params CreateResourceParams<T>
     * @returns void | Readonly<Resource<T>>
     */
    update<T = any>(params: Partial<CreateResourceParams<T>>): void | Readonly<Resource<T>>;
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
type CreateTextResourceParams = {
    name: string | symbol;
    mimeType?: `text/${string}`;
    factory?: ArrowFunction;
};
declare const createTextResource: (params: CreateTextResourceParams & AnyObject) => TagFunction;
/**
 * Name: createResource
 * Description: createResource API constructor
 * @public
 * @template T
 * @param params CreateResourceParams<T>
 * @returns Resource<T>
 */
declare const createResource: <T = any>(defaultParams: CreateResourceParams<T>) => (params?: Partial<CreateResourceParams<T>>) => Resource<T>;

/**
 * @module utils
 * Description: a collection of support functions for this package and elsewhere
 */

/**
 * Name: clamp
 * Desciption: Simple number clamp
 * @public
 * @param value
 * @param min
 * @param max
 * @returns number
 */
declare const clamp: (val: number, min: number, max: number) => number;
/**
 * Name: colorCodes
 * Description: ANSI color code wrapper
 * @public
 * @param color {string}
 * @returns {string}
 */
declare const colorCode: (color: string) => string;
/**
 * Name: colorCodes
 * Description: ANSI color code set
 * @public
 * @typedef {Object}
 */
declare const colorCodes: Record<string, string>;
/**
 * Name: colorEscapeCodes
 * Description: ANSI color code set
 * @public
 * @typedef {Object}
 */
declare const colorEscapeCodes: Record<string, string>;
/**
 * Name: createNamespacedRecord
 * Description: flattens object 2 levels deep into one level with namespaced keys
 * @public
 * @param obj AnyObject to flatten
 * @param delimeter string for joining
 * @returns AnyObject
 */
declare const createNamespacedRecord: (obj: AnyObject, delimeter?: string) => AnyObject;
/**
 * Name: TimeStamp
 * Description: Timestamp return typedef
 * @private
 * @typedef {Object}
 * @property {Date} raw
 * @property {string} formatted
 */
type TimeStamp = {
    raw: Date;
    formatted: string;
};
declare const createTimeStamp: (formatter?: Callable<Date, string>) => () => TimeStamp;
/**
 * Name: enumToArray
 * Description: Converts a TypeScript enum into an array
 * @public
 * @param val Enum
 * @returns Array<string | number>
 */
declare const enumToArray: (val: any) => Array<string | number>;
/**
 * Name: fakeUuid
 * Description: Creates a UUID formatted random string.
 *  - Not universally registered through a UUID service, hence 'fake'.
 * @public
 * @returns string in UUID format
 */
declare const fakeUuid: () => string;
/**
 * Name: filterUndefinedFromObject
 * Description: Filters any unused properties from objects
 * @public
 * @param obj AnyObject
 * @returns AnyObject
 */
declare const filterUndefinedFromObject: (obj: AnyObject) => AnyObject;
/**
 * Name: hexToUtf
 * Description: Convers a hex string into a UTF16 string
 * @public
 * @param str Hex string
 * @returns UTF16 string
 */
declare const hexToUtf: (str: string) => string;
/**
 * Name: interpolate
 * Description: Tagged string function parser and baseline tagged function creator
 * @public
 * @param strings Tagged Function Strings
 * @param values Tagged Function Values
 * @param props Component props
 * @returns parsed string
 */
declare const interpolate: (strings: TaggedFunctionStrings, values: InlineBlocks, props?: AnyObject) => string;
/**
 * Name: isNode
 * Desciption: Checks for node/deno vs browser. Not the most deterministic.
 * @public
 * @return boolean
 */
declare const isNode: () => boolean;
/**
 * Name: jsonObjectCopy
 * Description: Typed JSON cloning
 * @public
 * @param value JSOM compatible object
 * @returns Record<K, O>
 */
declare const jsonObjectCopy: <T extends object, K extends keyof T, O extends Json = Json>(value: T) => Record<K, O>;
/**
 * Name: arrayContentsRegex
 * Description: Regex for getting contents within brackets [content]
 */
declare const arrayContentsRegex: RegExp;
/**
 * Name: keyValObjOptions
 * Description: Object serializtion parameters
 * @private
 * @typedef {Object}
 * @property {T} AnyObject
 * @property {RegExp}
 * @property {typeof Function} callback
 * @property {string} delimeter
 * @property {string} objectNotation
 * @property {any} prefix
 * @property {string} separator
 */
type keyValObjOptions<T = AnyObject> = {
    accumulator?: T;
    arrayRegex?: RegExp;
    callback?: Callable<any, any>;
    delimeter?: string;
    objectNotation?: string;
    prefix?: any;
    separator?: string;
};
/**
 * Name: keyValToObject
 * Description: Recursively converts a key=val string to an object\
 * @public
 * @param str key=val string
 * @param options keyValObjOptions
 * @returns AnyObject
 */
declare const keyValToObject: (str: string, options?: keyValObjOptions<AnyObject>) => AnyObject;
/**
 * Name: JSONStringPrimitive
 * Description: helper for coverting JSON text values to primitives
 * @private
 * @typedef {null | boolean | string | number | bigint}
 */
type JSONStringPrimitive = null | boolean | string | number | bigint;
/**
 * Name: jsonStringToPrimitiveType
 * Description: Helper function for converting strings into primitives
 * @public
 * @param str
 * @returns JSONStringPrimitive
 */
declare const jsonStringToPrimitiveType: (str: string) => JSONStringPrimitive;
/**
 * Name: primitiveToJsonString
 * Description: Helper function for converting primitives into strings
 * @public
 * @param any
 * @returns string
 */
declare const primitiveToJsonString: (val: any) => any;
/**
 * Name: createProxy
 * Description: Typed proxy constructor
 * @public
 * @param handler
 * @returns (target) => ProxyHandler
 */
declare const createProxy: <T extends AnyObject = AnyObject<any>>(handler: ProxyHandler<T>) => (target: T) => ProxyHandler<T>;
/**
 * Name: objectToKeyVal
 * Description: Recursively converts an object to key=val string
 * @public
 * @param obj
 * @param options
 * @returns string
 */
declare const objectToKeyVal: (obj: AnyObject, options?: keyValObjOptions<string[]>) => string;
/**
 * Name: objectToSearchParams
 * Description: converts 2 level deep object to key=val string
 * @public
 * @param obj AnyObect
 * @returns string
 */
declare const objectToSearchParams: (obj: AnyObject) => string;
/**
 * Name: randomHexString
 * Description: Creates a random string that is base 16 (only 0-9a-fA-F) characters
 * @public
 * @param length
 * @returns
 */
declare const randomHexString: (length: number) => string;
/**
 * Name: randomInteger
 * Description: Random integer function that uses `Math.random().toString()`
 *   and converts it from a string to a number;
 * @public
 * @param digit digit count
 * @param options bigint, prefix, and sign options
 * @returns number | bigint
 */
type randomIntegerOptions = {
    bigint?: boolean;
    prefix?: string;
    sign?: '+' | '-';
};
declare const randomInteger: (digit?: number, options?: randomIntegerOptions) => bigint | number;
/**
 * Name: randomString
 * Description: Random String generator
 * @public
 * @param length Number: length of the final string
 * @param options prefix and filter options
 * @returns string
 */
type randomStringOptions = {
    prefix?: string;
    filterRegex?: RegExp;
};
declare const randomString: (length?: number, { prefix, filterRegex }?: randomStringOptions) => string;
/**
 * Name: removeWhitespace
 * Description: Normalizes whitespsace in a string
 * @public
 * @param str string
 * @returns string
 */
declare const removeWhitespace: (str: string) => string;
/**
 * Name: searchParamsToObject
 * Description: converts URLSearchParams to a 2 level deep object
 * @public
 * @param searchParams
 * @returns Record<any, any>
 */
declare const searchParamsToObject: (searchParams: URLSearchParams) => AnyObject<any>;
/**
 * Name: blockCommentRegEx
 * Description: Regex that removes block comments
 * @public
 */
declare const blockCommentRegEx: RegExp;
/**
 * Name: lineCommentRegEx
 * Description: Regex that removes line comments
 * @public
 */
declare const lineCommentRegEx: RegExp;
/**
 * Name: stripComments
 * Description: remove line and block comments from strings
 * @param str String to parse
 * @returns string that has been filtered
 */
declare const stripComments: (str: string) => string;
/**
 * Name: updateConstObject
 * Description: Used for updating each property on a const initialized object as reassignment is not allowed eg: spread operator or Object.assign
 * @public
 * @param target AnyObject of object to update
 * @param newObj
 */
declare const updateConstObject: (target: AnyObject, newObj: AnyObject) => void;
/**
 * Name: utfToHex
 * Description: Coverts human readable string into string hexadecimal version
 *   Strings are UTF-8 by default https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
 * @public
 * @param str
 * @returns {string}
 */
declare const utfToHex: (str: string) => string;

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

/**
 * Name: URLManager
 * Classdesc: URL class with additional static and instance methods for managing multiple generated URLs
 * @public
 * @class
 * Implements: URL
 */
declare class URLManager extends URL {
    private static generatedObjectURLS;
    /**
     * Override
     * https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
     * @static
     * @public
     * @param obj
     * @returns string
     */
    static createObjectURL(obj: File | Blob | MediaSource): string;
    /**
     * Name: currentUrl
     * Description: URLManager instance of current url
     * @static
     * @public
     * @returns URLManager
     */
    static get currentUrl(): URL;
    /**
     * Name: objectURLS
     * Description: string[] of objectUrls
     * @static
     * @public
     * @returns string[]
     */
    static get objectURLS(): Readonly<Array<string>>;
    /**
     * Name: revokeObjectURL
     * Description: Override
     * - https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static
     * @static
     * @public
     * @param url
     */
    static revokeObjectURL(url: string): void;
    /**
     * Name: revokeAllObjectURLs
     * Description: revokes all known object urls
     * @static
     * @public
     */
    static revokeAllObjectURLs(): void;
    /**
     * @constructor
     * @public
     * @param url
     */
    constructor(url: string);
    /**
     * Name: params
     * Description: Returns searchParams as Object instead of iterable
     *   - Arrays are repeated keys: `?key=val&key=val2` === { key: ['val', 'val2' ] }
     *   - Objects use dot notation: `?obj.key=val&obj.key=val2&obj.key2=val3` === { obj: { key: ['val', 'val2'], key2: 'val3' } }
     * @public
     * @returns Readonly<AnyObject>
     */
    get params(): Readonly<AnyObject>;
    /**
     * Name: params
     * Description:
     * @public
     * @param data Anyobject of params to set
     */
    set params(data: AnyObject);
}

export { ApiFactory, ApiRecord, AppliedMiddlewareFactory, AttributionReportingOptions, CACHE_ACTIONS, Cache, Console, CreateResourceParams, Decorator, DecoratorCallback, DecoratorCallbackParams, DecoratorReturnType, FetchParams, GlobalResource, HTTPCLIENT_ACTIONS, HTTPMethodValues, HTTPMethods, History, HistoryController, HttpClient, HttpClientParams, LOGGER_ACTIONS, LineOptions, LogLevel, LogRecord, Logger, MATCHER_ACTIONS, MapCache, Middleware, MiddlewareParams, Reducer, ReducerAction, ReducerCollection, RequestBody, RequestInit, RequestPriority, Resource, ResourceController, STORE_ACTIONS, Store, TransformMiddleware, URLManager, UncurriedMiddleware, applyMiddleware, arrayContentsRegex, blockCommentRegEx, clamp, clientFactory, colorCode, colorCodes, colorEscapeCodes, index as combinators, compose$1 as compose, createClassDecorator, createClassHandler, createClassMemberDecorator, createClassMethodHandler, createClassParameterHandler, createClassPropertyHandler, createDecorator, createHistory, createHistoryController, createHttpClient, createLogger, createMapCache, createMatcher, createMatcherProxyHandler, createMiddlewareApi, createNamespacedRecord, createProxiedMatchTarget, createProxiedMatcher, createProxy, createReducer, createResource, createStore, createTextResource, createTimeStamp, enumToArray, fakeUuid, filterUndefinedFromObject, hexToUtf, interpolate, isNode, jsonObjectCopy, jsonStringToPrimitiveType, keyValToObject, lineCommentRegEx, mountRootComponent, objectToKeyVal, objectToSearchParams, passthroughCreateApi, passthroughMiddleware, passthroughSort, passthroughTransform, primitiveToJsonString, randomHexString, randomInteger, randomString, removeWhitespace, searchParamsToObject, stripComments, updateConstObject, utfToHex };
