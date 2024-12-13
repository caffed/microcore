/**
 * Types
 * - These types are used in other packages
 */

/**
 * TypedArray
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/**
 * MimeType type constraint
 * - Organizing body: https://www.iana.org/assignments/media-types/media-types.xhtml
 * - Per: https://www.rfc-editor.org/rfc/rfc4288 section 4.2, total length is 127
 */
export type MimeType = 
  | `application/${string}`
  | `audio/${string}`
  | `font/${string}`
  | `haptics/${string}`
  | `image/${string}`
  | `message/${string}`
  | `model/${string}`
  | `multipart/${string}`
  | `text/${string}`
  | `video/${string}`;
/**
 * Types used for data
 */
export type ReduceFunction<
  A = any[],
  C = any,
  I = any[],
  R = any,
> = Callable<
  [accumulator: A, current: C, index?: number, array?: I],
  R>;
export type ObjectKey = string | symbol | number;
export type MapHashKey = ObjectKey | object | ArrowFunction;
// Used for extending interfaces
export interface AnyObject<T = any> { 
  [key: ObjectKey]: T;
}
// JSON type from Typescript site
export type Json = 
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type JsonObject<T extends Json, K extends keyof T> = Pick<T, K>;
/**
 * Types used for event listener callbacks
 */
export type Listener<T = any> = {
  handler: Handler<T>,
  options?: AnyObject<T>,
};
export type Handler<T = any> = (...data: T[]) => T | void;
export type Operator<T = any> = (...data: T[]) => Iterable<T | void>;
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
export type TaggedFunctionStrings = Readonly<string[]> | TemplateStringsArray;
export type InlineBlocks<R = any> = Array<string | ((props: any) => R)>;
export type TagFunction<R = any> = (strings: TemplateStringsArray, ...values: InlineBlocks) => R;
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
export type Callable<P = any, V = any> = 
  P extends never | null | undefined ? 
    () => V :
    P extends any[] ? 
      (...args: P) => V :
      P extends any ? ((arg: P) => V) | ((arg?: P) => V) :
        unknown;
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
export type Constructable<P = any, V = any> = 
  P extends never | null | undefined ?
    new () => V :
    P extends any[] ? 
      new (...args: P) => V :
      P extends any ? new (arg: P) => V :
        unknown;
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
export type ArrowFunction =
  | Callable<null, any>
  | Callable<any, any>
  | Callable<any[], any>;
export type AsyncArrowFunction =
  | Callable<null, Promise<any>>
  | Callable<any, Promise<any>>
  | Callable<any[], Promise<any>>;
export type ConstructorFunction = 
  | Constructable<null, any>
  | Constructable<any, any>
  | Constructable<any[], any>;
export type AsyncConstructorFunction =
  | Constructable<null, Promise<any>>
  | Constructable<any, Promise<any>>
  | Constructable<any[], Promise<any>>;

export type CompareFunction<A, B = A> = Callable<any[], number> | Callable<[A, B], number>;

// TODO: evaluate use of range
// https://github.com/microsoft/TypeScript/issues/43505#issuecomment-1686128430
export type NumericRange<
  start extends number,
  end extends number,
  arr extends unknown[] = [],
  acc extends number = never,
  > = arr['length'] extends end
  ? acc | start | end
  : NumericRange<start, end, [...arr, 1], arr[start] extends undefined ? acc : acc | arr['length']>;

// TODO: reformat for my own needs. remove string
/**
 * Rewrtitten from 
 */
export type TruncateString<
  T extends string,
  N extends number,
  L extends any[] = [],
  S extends string = "",
> =
  N extends L['length'] ?
    S :
    T extends `${infer F}${infer R}` ?
      TruncateString<R, N, [0, ...L], `${S}${F}`> :
      S;


export type State<T extends Json = Json> = {
  revisionId: string;
  value: T;
};

export type Action<T = any> = {
  type: string;
  data?: T;
} & AnyObject;