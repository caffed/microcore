/**
 * @module transaction
 * @description Middleware container for 'unit-of-work' like transactions
 */

import {
  noop,
} from '../combinators';
import {
  createLogger,
  type Logger,
} from '../logger';
import {
  createMiddlewareApi,
  passthroughMiddleware,
  passthroughTransform,
  type MiddlewareParams,
} from "../middleware";
import {
  Action,
  AnyObject,
  Json,
  State,
} from '../types';
import {
  jsonObjectCopy,
} from '../utils'

/**
 * Name: TRANSACTION_ACTIONS
 * Description: Transactions actions to be used for middleware
 * @public
 * @readonly
 * @enum {string}
 */
export enum TRANSACTION_ACTIONS {
  TRANSACTION_COMMIT = 'TRANSACTION_COMMIT',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
}

/**
 * Name: createTransaction
 * Description: Overview
 * - the Transaction module is the foundation of pseudo-ETL data flow
 * - the Transaction module is the foundation of async Reducer functionality
 * - At minimum a transaction should
 *   - log each stage of a transaction
 *   - each middleware should have a commit and rollback callback
 *     
 *   - be able to retry a transaction
 *   - be able to use a fallback strategy for each stage of the transaction
 *   - be able to rollback a transaction
 * 
 * - middleware transform
 * @public
 * @param params CreateTransactionParams & MiddlewareParams
 * @returns <V, D>(state: State<V>, action: Action<D>) => { commit, rollback }
 */
type CreateTransactionParams = {
  options?: AnyObject;
};
export const createTransaction = (params: CreateTransactionParams & MiddlewareParams = {}) => {
  const {
    createApi,
    middleware = [{ middleware: passthroughMiddleware }],
    options = {},
    sort,
    transform = passthroughTransform,
  } = params;

  let logger: Logger = {
    log: noop,
    updateOptions: noop,
  };

  if (options.logger) {
    const prefix = ['Transaction', options.logger.prefix].join(' - ');
    logger = createLogger({
      prefix,
    });
  }

  const transactionTransform = (
    acc: any[],
    curr: any,
    idx: number,
    arr: any[]
  ) => {
    const transactionMiddlewareCurrent = { 
      data: curr.data,
      middleware: (...args: any[]): any => {
        try {
          logger.log('middleware:arguments', { 
            arguments: [...args],
          });
          const result = curr.middleware(...args);
          logger.log('middleware:return', { 
            return: result,
          });
          return result;
        } catch (err) {
          logger.log('middleware:error', err);
        }
      }
    };
    return transform(acc, transactionMiddlewareCurrent, idx, arr);
  };

  // index decrement middleware order
  const commitApi = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform: transactionTransform,
  });

  // index increment middleware order
  const rollbackApi = createMiddlewareApi({
    createApi,
    middleware: middleware.reverse(),
    sort,
    transform: transactionTransform,
  });

  return <V extends Json, D = any>(state: State<V>, action: Action<D>) => {
    const stateCopy = jsonObjectCopy<State<V>, keyof State<V>>(state);
    const actionCopy = jsonObjectCopy<Action<D>, keyof Action<D>>(action);

    return {
      commit() {
        try {
          return commitApi({
            action: {
              data: {
                options,
              },
              type: TRANSACTION_ACTIONS.TRANSACTION_COMMIT,
            },
          }).middleware({
            action,
            state,
          });
        } catch(err: any) {
          logger.log(err);
        }
      },
      rollback() {
        try {
          return rollbackApi({
            action: {
              data: {
                options,
              },
              type: TRANSACTION_ACTIONS.TRANSACTION_ROLLBACK,
            },
          }).middleware({
            action: actionCopy,
            state: stateCopy,
          });
        } catch(err) {
          logger.log(err);
        }
      },
    };
  };
};
