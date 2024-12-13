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

import {
  identity,
} from "../combinators";
import type {
  AnyObject,
  ArrowFunction,
  Callable,
  CompareFunction,
  ReduceFunction,
} from "../types";

/**
 * Name: passthroughCreateApi
 * Description: Default passthrough createApi function. 
 *  Creates resultant object with the middleware() method
 * @param api
 * @returns object of middleware APO
 */
export const passthroughCreateApi = (api?: any | any[]) => {
  return {
    ...api,
    middleware: identity,
  }
};

/**
 * Name: passthroughMiddleware
 * Description: Default passthrough middleware.
 * @param
 * @returns Default middleware for chain
 */
export const passthroughMiddleware = (_: unknown) => {
  return (middleware: Callable<any[], any>) => {
    return (...params: any[]) => {
      return middleware(...params);
    };
  }
};

/**
 * Name: passthroughSort
 * Description: Default passthrough sort. A 'noop' sort. Ignores params for sort and returns '0'
 * @returns 0 for compare function
 */
export const passthroughSort = (..._: any[]) => 0;

/**
 * Name: passthroughTransform
 * Description: Default passthrough transform for the createMiddleware reducer
 * @param acc Array<any>
 * @param cm TransformMiddleware<T, R>
 * @returns Middleware<T, R>[]
 */
export const passthroughTransform = <
  T = any,
  R = any
>(
  acc: any[],
  tm: TransformMiddleware<T, R>,
) => acc.concat(tm.middleware);

/**
 * Middleware types
 * NOTE: These will be refactored in the future. Do not use these directly right now.
 */
export type ApiFactory<T = any, R = any> = Callable<T[], ApiRecord<T, R>>;
export interface ApiRecord<T = any, R = any> extends AnyObject {
  middleware(args: T): R;
  middleware(...args: any[]) : R;
}
export type AppliedMiddlewareFactory<T = any, R = any> = Callable<ApiFactory<T, R>, ApiFactory<T, R>>;
export type Middleware<T = any, R = any> = (api: ApiRecord<T, R> | Middleware<T, R>) => UncurriedMiddleware<T, R>;
export type MiddlewareParams<T = any, R = any, A = any, B = A> = {
  createApi?: ApiFactory<T, R>;
  middleware?: TransformMiddleware<T, R>[];
  sort?: CompareFunction<A, B>;
  transform?: Callable<any[], any>;
};
export type TransformMiddleware<T = any, R = any> = {
  data?: AnyObject;
  middleware: Middleware<T, R>;
} & AnyObject;
export type UncurriedMiddleware<T = any, R = any> = Callable<Middleware<T, R>, ArrowFunction>;

/**
 * Name: compose
 * Description: B/compose combinator. Compose combinator speciffically designed
 *  to handle Middleware (not general purpose).
 * @public
 * @template M - Middleware type
 * @param middlewares
 * @returns ArrowFunction of chained middleware
 */
export function compose<M extends Middleware>(...middlewares: M[]): ArrowFunction {
  if (middlewares.length === 0) {
    // return identity so that the middleware chain can complete
    return identity;
  }
  // return the only function as this reduce is curried
  if (middlewares.length === 1) {
    return middlewares[0]; 
  }
  // return curried chain of operators
  return middlewares
    .reduce((prev, curr) =>
      /**
       * TODO: Remove ts-expect-error directive for last spread once issues are resolved.
       *   TypeScript is erroneously raising error 2556 with generics for spread arguments
       *   https://github.com/microsoft/TypeScript/issues/57322
       *   https://github.com/microsoft/TypeScript/pull/53615
       */
      /* @ts-expect-error ts2556 */
      (...args: any[]) => prev(curr(...args)));  
};

/**
 * Name: applyMiddleware
 * Description: Apply/A combinator. Apply combinator and main entry point for creating miuddleware
 * @public
 * @template T, R - T: parameter type, R: return type
 * @param middlewares Array of middleware
 * @returns AppliedMiddlewareFactory<T, R>
 */
export function applyMiddleware<T = any, R = any>(...middlewares: Middleware<T, R>[]): AppliedMiddlewareFactory<T, R> {
  // createApi must be function that returns an object
  return (createApi: ApiFactory<T, R>) : ApiFactory<T, R> => (...apiArgs: any[]): ApiRecord<T, R> => {
    // `api` must be a value that can be passed to an operator
    const api = createApi(...apiArgs);
    // Populate `api` as first part of middleware function currying
    const chain = middlewares.map(middleware => middleware(api));
    // Create curried reduce for execution chain
    const middleware = compose<Middleware<T, R>>(...chain)(api.middleware);
    // returned merged API object
    return {
      ...api,
      middleware,
    };
  };
};

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
type CreateMiddlewareParams<
  T = any,
  R = any,
  A extends TransformMiddleware<T, R> = TransformMiddleware<T, R>,
  B extends TransformMiddleware<T, R> = A,
> = {
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
export const createMiddlewareApi = <
  T = any,
  R = any,
  A extends TransformMiddleware<T, R> = TransformMiddleware<T, R>,
  B extends TransformMiddleware<T, R> = A,
>(params: CreateMiddlewareParams<T, R, A, B> = {}) => {
  const {
    createApi = passthroughCreateApi,
    middleware = [{ middleware: passthroughMiddleware }],
    sort = passthroughSort,
    transform = passthroughTransform,
  } = params;
  return applyMiddleware<T, R>(
    ...middleware
      .sort(sort)
      .reduce((
        acc: any[],
        curr: TransformMiddleware<T, R>,
        idx: number,
        arr: TransformMiddleware<T, R>[]
      ) => {
        return transform(acc, curr, idx, arr);
      }, [])
  )(createApi);
};
