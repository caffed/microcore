/**
 * @module reducer/store
 * Description: The main reducer API entrypaint
 */

import {
  createMiddlewareApi,
  type MiddlewareParams,
} from "../middleware";
import {
  createNamespacedRecord,
  enumToArray,
} from '../utils';
import type {
  Action,
  AnyObject,
  ArrowFunction,
  Callable,
  Json,
  State,
} from "../types";
import {
  createHistoryController,
  type HistoryController,
} from './history';
import {
  defaultEnhancerMiddleware,
} from "./middleware";
import type {
  ReducerAction,
  ReducerCollection,
} from './reducer';

/**
 * Name: Store
 * Description: Store API object
 * @public
 * @typedef {Object}
 */
export type Store<
  T extends Json = Json,
  S extends State<T> = State<T>,
  A extends Action<T> = Action<T>
> = {
  actions: ReducerCollection<T, S>, // Record<string, Reducer<T, S>>,
  dispatch: Callable<A, void>,
  getState: Callable<null, S>,
  name: string;
  subscribe: Callable<ArrowFunction, Callable<null, void>>,
};

/**
 * Name: STORE_ACTIONS
 * Description: Store actions to be used for reducers or similar
 * @public
 * @readonly
 * @enum {string}
 */
export enum STORE_ACTIONS {
  DISPATCH_ACTION = '@DISPATCH_ACTION',
  SUBSCRIBE = '@SUBSCRIBE',
  UNSUBSCRIBE = '@UNSUBSCRIBE',
  CLEAR = '@CLEAR',
  JUMP_TO_FUTURE_REVISION = '@JUMP_TO_FUTURE_REVISION',
  JUMP_TO_PAST_REVISION = '@JUMP_TO_PAST_REVISION',
  JUMP_TO_REVISION = '@JUMP_TO_REVISION',
  REDO = '@REDO',
  UNDO = '@UNDO',
};

/**
 * Name: STORE_ACTIONS_ARRAY
 * Description: A string[] for store middleware
 * @public
 * @readonly
 * @typedef {string[]} STORE_ACTIONS_ARRAY
 */
const STORE_ACTIONS_ARRAY = enumToArray(STORE_ACTIONS);

/**
 * Name: StoreParams
 * Description: StoreParams params object
 * @private
 * @typedef {Object}
 */
type StoreParams<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
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
export const createStore = <
  T extends Json = Json,
  S extends State<T> = State<T>
>(params: StoreParams<T, S> & MiddlewareParams): Store<T, S> => {
  const {
    historyCtl = createHistoryController<T, S>(),
    name,
    options = {},
    createApi,
    sort,
    transform,
    reducers,
  } = params;
  let {
    middleware = [],
  } = params;

  const reducerActions: Record<string, ReducerAction<T, S>> = createNamespacedRecord(reducers);
  
  // Ensuring index 0 so that default functionality is last in chain
  middleware = [
    {
      middleware: defaultEnhancerMiddleware({
        historyCtl,
      }),
    },
    ...middleware,
  ];

  const subscribers = new Map<ArrowFunction, ArrowFunction>();

  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return {
    // dispatch take action and push
    get actions(): Readonly<Record<string, ReducerAction<T, S>>> {
      return reducerActions;
    },
    dispatch(action: Action<T>): void {
      // map action.type to correct reducer action
      const reducerAction = reducerActions[action.type];
      if (reducerAction || STORE_ACTIONS_ARRAY.includes(action.type)) {
        // get current state
        const state = historyCtl.getState();
        // pass state and action to "enhancers"
        api({
          action: {
            type: STORE_ACTIONS.DISPATCH_ACTION,
            data: {
              options,
              subscribers,
            },
          },
        }).middleware({
          action,
          reducerAction,
          state,
        });
      }
    },
    getState(): Readonly<S> {
      return historyCtl.getState();
    },
    get name(): Readonly<string> {
      return name;
    },
    subscribe(callback: ArrowFunction) {
      api({
        action: {
          data: {
            options,
            subscribers,
          },
          type: STORE_ACTIONS.SUBSCRIBE,
        },
      }).middleware({ callback });
      return () => {
        api({
          action: {
            data: {
              options,
              subscribers,
            },
            type: STORE_ACTIONS.UNSUBSCRIBE,
          },
        }).middleware({ callback });
      }
    },
  }
};
