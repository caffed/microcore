/**
 * @module matcher
 * Description: Validation framework which can be used for testing matchers, 
 *  input valiation, or similar use cases
 */

import {
  createMiddlewareApi,
  type MiddlewareParams,
} from "../middleware";
import {
  AnyObject,
  Callable,
} from "../types";
import {
  createProxy,
} from "../utils";


/**
 * Name: MATCHER_ACTIONS
 * Description: Matcher actions for middleware
 * @public
 * @readonly
 * @enum {string}
 */
export enum MATCHER_ACTIONS {
  MATCH = 'MATCH',
}

/**
 * Name: CreateMatchParams
 * Description: options to pass to matcher middleware
 * @private
 * @typedef {AnyObject} options object
 */
type CreateMatchParams = {
  options?: AnyObject,
};

/**
 * Name: CreateMatchParams
 * Description: options to pass to matcher middleware
 * @public
 * @template A, B - types for subjects to be compared
 * @param params Middleware options for matcher
 * @returns Callable<[A, B], boolean>
 */
export const createMatcher = <
  A = any,
  B = A,
>(
  params: CreateMatchParams & MiddlewareParams = {},
): Callable<[A, B], boolean> => {
  const {
    createApi,
    middleware,
    options = {},
    sort,
    transform,
  } = params;
  // Create middleware
  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return (a: A, b: B) : boolean => {
    return api({
      action: {
        type: MATCHER_ACTIONS.MATCH,
        data: {
          options,
        },
      },
    }).middleware(a, b);
  };
};

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
export const createMatcherProxyHandler = <
  H extends AnyObject = AnyObject,
  P extends string | symbol = string | symbol,
  R = any,
>(
  defaultHandler: AnyObject = {}, 
  options: AnyObject = {},
): ProxyHandler<H> => {
  const {
    logger = globalThis.console.log,
  } = options;
  return {
    ...defaultHandler,
    get: (target: H, prop: P, receiver: R) => {
      if (!target[prop]) {
        logger(`Something went wrong... '${prop.toString()}' does not exist on ${receiver}.`);
        return target;
      }
      return target[prop];
    },
  };
};

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
export const createProxiedMatcher = <
  A = any,
  B = A,
>(
  params: ProxiedMatcherParams & MiddlewareParams = {},
): ProxyHandler<AnyObject> => {
  const {
    createApi,
    sort,
    transform,
    defaultHandler = {},
    defaultTarget = {},
    methodName = 'match',
    middleware,
  } = params;

  return createProxy(createMatcherProxyHandler(defaultHandler))({ 
    ...createProxiedMatchTarget(defaultTarget),
    [methodName]: createMatcher<A, B>({ createApi, middleware, sort, transform }),
  }); 
};

/**
 * Name: createDataContainer
 * Description: create mutatable object used for assertion data 
 * @private
 * @param expression any
 * @returns object of data container
 */
const createDataContainer = (expression: any): AnyObject => {
  return {
    expression,
    eval: (optionalExpected: any) => {
      const result = optionalExpected || expression;
      return typeof result === 'function' ? result() : result;
    },
    negate: false,
  };
}



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
export const createProxiedMatchTarget = (target: AnyObject): AnyObject => {
  let data: AnyObject;

  const methods = {
    /**
     * Name: be
     * Description: assertion chain method
     * @returns object of assertion methods
     */
    get be() {
      return {
        instanceOf(actual: any, optionalExpected?: any) {
          const expected = data.eval(optionalExpected);
          return methods.eq(true, expected instanceof actual);
        },
        typeOf(type: string, optionalExpected?: any) {
          const expected = data.eval(optionalExpected);
          return methods.eq(type, typeof expected);
        },
        get array() {
          return this.instanceOf(Array);
        },
        get bigint() {
          return this.typeOf('bigint');
        },        
        get boolean() {
          return this.typeOf('boolean');
        },
        get false() {
          return methods.eq(false);
        },
        get function() {
          return this.typeOf('function');
        },
        get NaN() {
          if (!data.negate && !isNaN(data.eval())) {
            throw new Error(`Expected is not a NaN value: ${data.eval()}`);
          }
          return this.typeOf('number');
        },
        get number() {
          return this.typeOf('number');
        },
        get null() {
          return methods.eq(null);
        },
        get object() {
          return this.typeOf('object');
        },
        get set() {
          return this.instanceOf(Set);
        },
        get string() {
          return this.typeOf('string');
        },
        get symbol() {
          return this.typeOf('symbol');
        },
        get true() {
          return methods.eq(true);
        },
        get undefined() {
          return this.typeOf('undefined');
        },
      };
    },
    /**
     * Name: eq
     * Description: assertion chain equality method
     * @param actual 
     * @param optionalExpected 
     * @returns boolean
     */
    eq(actual: any, optionalExpected?: any) {
      const expected = data.eval(optionalExpected);
      if (data.negate && expected === actual ||
          !data.negate && expected !== actual) {
        throw new Error(`Expected: ${data.negate ? 'not' : ''} ${expected}, actual: ${actual}.`);
      }
      return true;
    },
    /**
     * Name: include
     * Description: assertion chain actual in expected assertion method
     * @param actual 
     * @param optionalExpected 
     * @returns 
     */
    include(actual: any, optionalExpected?: any) {
      const expected = data.eval(optionalExpected);
      switch(typeof expected) {
        case 'object': {
          if (expected instanceof Array) {
            return methods.eq(true, expected.includes(actual));
          } else {
            return methods.eq(true, Reflect.ownKeys(expected).includes(actual));
          }
        }
        case 'string': {
          return methods.eq(true, expected.includes(actual));
        }
        default: {
          throw new Error(`Unsupported type. Currently only strings, objects and arrays are supported. Provided: ${expected}.`)
        }
      }
    },
    /**
     * Name: not
     * Description: negates assertion chain
     * @returns object of methods
     */
    get not() {
      data.negate = !data.negate;
      return methods;
    },
    /**
     * Name: to
     * @returns object of methods
     */
    get to() {
      return methods;
    },
    /**
     * Name: throw
     * Description: assertion chain method for code block throwing 
     * NOTE: All error constructors inherit from Error so 
     *   matcher.expect(throwsSomeError).to.not.throw(Error)
     *   will always fails
     * @param error 
     * @param optionalExpected
     */
    throw(error?: any, optionalExpected?: any) {
      let caughtError: any, threw: boolean, expected: any;
      
      try {
        expected = data.eval(optionalExpected);
        expected();
      } catch (err: any) {
        caughtError = err; 
        threw = true;
      }

      if (data.negate) {
        // success to not throw
        if (error) {
          methods.eq(false, caughtError instanceof error);
        } else if (threw) {
          throw new Error(`Expected expression: ${expected.toString()}, threw error when not expected to: ${caughtError}`);
        }
      } else {
        // success to throw
        if (error) {
          methods.eq(true, caughtError instanceof error);
        } else if (!threw) {
          throw new Error(`Expected expression: ${expected.toString()}, did not throw error when expected to: ${expected.toString()}`);
        }
      }
    },
  };

  return {
    ...target,
    expect(expected: any) {
      data = createDataContainer(expected);
      return methods;
    },
  };
};
