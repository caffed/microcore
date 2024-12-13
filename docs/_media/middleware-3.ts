/**
 * @module reducer/middleware
 * Description: Default reducer store functionality. Handles all REDUCER_ACTIONS.
 */

import {
  noop,
} from '../combinators';
import {
  createLogger,
  type Logger,
} from '../logger';
import type {
  ArrowFunction,
  Callable,
  Json,
  State,
} from "../types";
import type {
  HistoryController,
} from "./history";

/**
 * Name: DefaultEnhancerParams
 * Description: DefaultEnhancerParams object
 * @private
 * @typedef {Object}
 */
type DefaultEnhancerParams<
  T extends Json = Json,
  S extends State<T> = State<T>,
> = {
  historyCtl: HistoryController<T, S>;
}

/**
 * Name: defaultEnhancerMiddleware
 * Description: Default store "enhancer" middleware. Handles logging, dispatch and subscribing.
 * @public
 * @template T, S
 * @param params DefaultEnhancerParams
 * @returns enhancer middleware
 */
export const defaultEnhancerMiddleware = <
  T extends Json = Json,
  S extends State<T> = State<T>,
>(
  params: DefaultEnhancerParams<T, S>
) => {
  const {
    historyCtl,
  } = params;

  return (api: any) => {
    const {
      data,
      type,
    } = api.action;

    const {
      subscribers,
    } = data;

    let logger: Logger = {
      log: noop,
      updateOptions: noop,
    };

    if (data?.options?.logger) {
      const prefix = ['Reducer Store Dispatch', data.options.logger.prefix].join(' - ');
      logger = createLogger({
        prefix,
      });
    }

    return (middleware: Callable<any[], any>) => {
      return (params: any) => {
        const {
          action,
          callback,
          reducerAction,
          state,
        } = params;

        if (type === '@DISPATCH_ACTION') {
          switch(action.type) {
            case '@CLEAR': {
              logger.log('Action: [@CLEAR]');
              return historyCtl.clear();
            }
            case '@JUMP_TO_FUTURE_REVISION': {
              logger.log('Action: [@JUMP_TO_FUTURE_REVISION]', { action, state });
              const { revisionId } = action.data;
              return historyCtl.jumpToFutureRevision(revisionId);
            }
            case '@JUMP_TO_PAST_REVISION': {
              logger.log('Action: [@JUMP_TO_PAST_REVISION]', { action, state });
              const { revisionId } = action.data;
              return historyCtl.jumpToPastRevision(revisionId);
            }
            case '@JUMP_TO_REVISION': {
              logger.log('Action: [@JUMP_TO_REVISION]', { action, state });
              const { revisionId } = action.data;
              return historyCtl.jumpToRevision(revisionId);
            }
            case '@REDO': {
              logger.log('Action: [@REDO]', { action });
              const { steps } = action.data;
              return historyCtl.redo(steps);
            }
            case '@UNDO': {
              logger.log('Action: [@UNDO]: ', { action });
              const { steps } = action.data;
              return historyCtl.undo(steps);
            }
            default: {
              logger.log({ action, state });
              const result = reducerAction(state, action);
              logger.log({ result });
              const newState = historyCtl.setState(result.value);
              for(const [_, cb] of <Map<ArrowFunction, ArrowFunction>>subscribers) {
                cb({action, state, newState});
              }
              return;
            }
          }
        } else if (type === '@SUBSCRIBE') {
          subscribers.set(callback, callback);
        } else if (type === '@UNSUBSCRIBE') {
          subscribers.delete(callback);
        }

        return middleware(params);
      };
    };
  };
};
