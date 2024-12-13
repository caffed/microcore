/**
 * @module reducer/reducer
 * Description: Reducer, ReducerAction APIs
 */

import {
  randomString,
} from "../utils";
import type {
  Action,
  Callable,
  Json,
  State,
} from "../types";

/**
 * Name: Reducer
 * Description: Reducer API object
 * @public
 * @typedef {Object}
 */
export type Reducer<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
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
export type ReducerAction<
  T extends Json = Json,
  S extends State<T> = State<T>,
  A extends Action<T> = Action<T>
> = Callable<[state: S, action?: A], S>;

/**
 * Name: ReducerCollection
 * Description: ReducerCollection object
 * @public
 * @typedef {Object}
 */
export type ReducerCollection<
  T extends Json = Json,
  S extends State<T> = State<T>
> = Record<string | symbol, ReducerAction<T, S>>;

/**
 * Name: CreateReducerParams
 * Description: CreateReducerParams params object
 * @private
 * @typedef {Object}
 */
type CreateReducerParams<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
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
export const createReducer = <
  T extends Json = Json,
  S extends State<T> = State<T>
>(params?: CreateReducerParams<T, S>): Reducer<T, S> => {
  const {
    actions = {},
    name = randomString(),
  } = params;
  
  let reducerActions = new Map<string | symbol, ReducerAction<T, S>>();

  const reducer = {
    dispatch: (state: S, action: Action<T>): Readonly<S> => {
      return reducer.hasAction(action.type) ?
        reducer.getAction(action.type)(state) :
        state;
    },
    getAction: (key: string | symbol) => {
      return reducerActions.get(key);
    },
    getAllActions(): Readonly<ReducerCollection<T, S>> {
      const reducerActionsObject: ReducerCollection<T, S> = {};
      for (const [key, val] of reducerActions) {
        reducerActionsObject[key] = val;
      }
      return reducerActionsObject;
    },
    hasAction: (name: string | symbol): boolean => {
      return reducerActions.has(name);
    },
    get name(): Readonly<string> {
      return name;
    },
    removeAction: (name: string | symbol): void => {
      reducerActions.delete(name);
    },
    removeAllActions(): void {
      reducerActions = new Map<string | symbol, ReducerAction<T, S>>();
    },
    setAction: (name: string | symbol, action: ReducerAction<T, S>) => {
      reducerActions.set(name, action);
    },
    setActions: (actionsObject: ReducerCollection<T, S> = {}) => {
      Reflect.ownKeys(actionsObject)
        .forEach((action: string | symbol) => {
          reducer.setAction(action, actionsObject[action]);
        });
    },
  };

  reducer.setActions(actions);

  return reducer;
};
