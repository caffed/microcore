/**
 * @module decorators
 * A decorator library based off of: 
 *   https://www.typescriptlang.org/docs/handbook/decorators.html
 * Description: A middleware enabled framework for simplifying creating decorators
 */
import {
  noop,
} from "../combinators";
import {
  type ApiRecord,
  createMiddlewareApi,
  MiddlewareParams,
} from "../middleware";
import type {
  AnyObject,
  ArrowFunction,
  Callable,
  Constructable,
  ConstructorFunction,
} from "../types";
import {
  filterUndefinedFromObject,
  updateConstObject,
} from "../utils";

/**
 * Name: Decorator<T, V, R>
 * Description: Superset Decorator type
 * @public
 * @template T, V, R - T: target type, V: TypedPropertyDescriptor value, R: return type 
 * @typedef {Function} Decorator<T, V, R>
 */
export type Decorator<
  T extends 
    | Callable 
    | Constructable,
  V = any,
  R extends DecoratorReturnType<V> = DecoratorReturnType<V>
> = Callable<[
  target: T,
  propertyKey?: 
    | string
    | symbol,
  optionalParam?: 
    | number
    | PropertyDescriptor
    | TypedPropertyDescriptor<V>,
], R>;

/**
 * Name: DecoratorCallback<T, V>
 * Description: 
 * @public
 * @template T, V - T: target type, V: TypedPropertyDescriptor value
 * @typedef {Function} DecoratorCallback<T, V>
 */
export type DecoratorCallback<T, V, R = any> = Callable<DecoratorCallbackParams<T, V>, R>;

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
export type DecoratorCallbackParams<T, V> = {
  target: T,
  propertyKey?:
    | string
    | symbol,
  descriptor?: 
    | PropertyDescriptor
    | TypedPropertyDescriptor<V>,
  parameterIndex?: number,
  api?: Callable<any[], ApiRecord>,
};

/**
 * Name: DecoratorReturnType
 * Description: Pattern matching type for all possible return types for a decorator
 * @public
 * @template V - TypedPropertyDescriptor value
 * @typedef {void | Callable | Constructable | typeof Function | PropertyDescriptor | TypedPropertyDescriptor<D>} - creates a union type: 'DecoratorReturnType'
 */
export type DecoratorReturnType<V = any> =
  | void
  | Callable
  | Constructable
  | typeof Function
  | PropertyDescriptor
  | TypedPropertyDescriptor<V>;

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
export const createDecorator = <
  T extends 
    | ArrowFunction
    | ConstructorFunction,
  V = any,
  R extends DecoratorReturnType<V> = DecoratorReturnType<V>
>(params: CreateDecoratorParams<T, V>): Decorator<T, V, R> => {
  const {
    callback,
    createApi,
    middleware,
    sort,
    transform,
  } = params;

  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return (
    target: T,
    propertyKey?: 
      | string
      | symbol,
    optionalParam?: 
      | number
      | PropertyDescriptor
      | TypedPropertyDescriptor<V>
  ): R => {
    let descriptor: 
      | PropertyDescriptor
      | TypedPropertyDescriptor<V>;
    let parameterIndex: number;

    if (typeof optionalParam === 'number') {
      parameterIndex = optionalParam;
    } else if (optionalParam) {
      descriptor = optionalParam;
    }

    const values: AnyObject = {
      api,
      descriptor,
      parameterIndex,
      propertyKey,
      target,
    };

    const filteredValues = <DecoratorCallbackParams<T, V>>filterUndefinedFromObject(values);

    return callback(filteredValues);
  };
};

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
export const createClassDecorator = <
  T extends ConstructorFunction = ConstructorFunction,
  V = any,
  R extends DecoratorReturnType<V> = 
    | void
    | FunctionConstructor,
>(params: CreateDecoratorParams<T, V>) => {
  return createDecorator<T, V, R>(params);
};

/**
 * Name: createClassMemberDecorator<T, V, R>
 * Description: Class Member (inner level) decorator factory
 * @public
 * @param params CreateDecoratorParams<T, V>
 * @returns Decorator<T, V, R>
 */
export const createClassMemberDecorator = <
  T extends ConstructorFunction = ConstructorFunction,
  V = any,
  R extends DecoratorReturnType<() => void> = 
    | void
    | PropertyDescriptor
    | TypedPropertyDescriptor<() => void>,
>(params: CreateDecoratorParams<T, V>) : any => {
  return createDecorator<T, V, R>(params);
};

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
export const createClassHandler = (callback: Callable<any[], void>) => {
  return (target: ConstructorFunction) => {
    callback(target);
  }
};

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
export const createClassMethodHandler = <V = any>(
  {
    callback,
    newDescriptor,
  } : {
    callback?: Callable<any[], void>,
    newDescriptor: 
      | PropertyDescriptor
      | TypedPropertyDescriptor<V>
  }
) => {
  return (
    target: any,
    propertyKey: 
      | string
      | symbol,
    descriptor:
      | PropertyDescriptor
      | TypedPropertyDescriptor<V>
  ) : void => {
    if (callback) {
      callback(target, propertyKey, descriptor);
    } else if (newDescriptor) {
      updateConstObject(descriptor, newDescriptor);
    }
  };
};

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
export const createClassParameterHandler = (
  callback: Callable<any[], void> = noop
) => {
  return (
    target: AnyObject,
    propertyKey:
      | string
      | symbol,
    parameterIndex: number
  ) => {
    callback(target, propertyKey, parameterIndex);
  };
};

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
export const createClassPropertyHandler = (
  {
    callback,
    accessors,
  }: {
    callback?: Callable<any[], void>,
    accessors?: {
      get?: Callable<null, any>,
      set?: Callable<any, void>,
    }
  }) => {
  return (
    target: any,
    propertyKey:
      | string
      | symbol
  ) : void => {
    if (callback) {
      callback(target, propertyKey);
    } else if (accessors) {
      Reflect.defineProperty(target, propertyKey, accessors);
    }
  }
};
