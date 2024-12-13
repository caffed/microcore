/**
 * @module reducer/history
 * Description: History and HistoryController APIs
 */

import type {
  Callable,
  Json,
  State,
} from '../types';
import {
  fakeUuid,
  jsonObjectCopy,
} from "../utils";

/**
 * Name: History
 * Description: History object
 * @public
 * @typedef {Object}
 * @property {S[]} past
 * @property {undefined | S} current
 * @property {S[]} future
 */
export type History<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
  past: Array<S>;
  current:
    | undefined
    | S;
  future: Array<S>;
};

/**
 * Name: HistoryController
 * Description: History Controller object
 * @public
 * @template T, S
 * @typedef {Object}
 */
export type HistoryController<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
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
type HistoryParams<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
  current?: S;
  future?: S[];
  past?: S[];
};
export function createHistory<
  T extends Json = Json,
  S extends State<T> = State<T>
>(params: HistoryParams<T, S> = {}): History<T, S> {
  const {
    current, 
    future = [],
    past = [],
  } = params;

  return {
    past,
    current,
    future, 
  };
};

/**
 * Name: pruneHistory
 * Description: remove entries past limit
 * @private
 * @template T, S
 * @typedef {Object}
 */
const pruneHistory = <
  T extends Json = Json,
  S extends State<T> = State<T>
>(history: History<T, S>, limit?: number) => {
  if (limit && limit > 0) {
    if (history.past.length > limit) {
      history.past = history.past.slice(0, limit);
    }
    if (history.future.length > limit) {
      history.future = history.future.slice(0, limit);
    }
  }
}

/**
 * Name: CreateHistoryControllerParams
 * Description: CreateHistoryControllerParams object
 * @private
 * @template T, S
 * @typedef {Object}
 */
type CreateHistoryControllerParams<
  T extends Json = Json,
  S extends State<T> = State<T>
> = {
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
export function createHistoryController<
  T extends Json = Json,
  S extends State<T> = State<T>
>(
  params: CreateHistoryControllerParams<T, S> = {},
): HistoryController<T, S> {
  const {
    idFactory = fakeUuid,
    limit,
  } = params;
  let {
    history = createHistory<T, S>(),
  } = params;

  const historyCtrl = {
    clear: (): void => {
      history = createHistory<T, S>();
    },
    getHistory: (): Readonly<History<T, S>> => {
      return history;
    },
    getState: (): Readonly<S> => {
      return history.current;
    },
    jumpToFutureRevision: (revisionId: string): void | Readonly<S> => {
      let state: S;
      for (const [idx, s] of history.future.entries()) {
        if (s.revisionId === revisionId) {
          state = historyCtrl.redo(idx + 1);
          break;
        }
      }
      return state;
    },
    jumpToPastRevision: (revisionId: string): void | Readonly<S> => {
      let state: S;
      for (const [idx, s] of history.past.entries()) {
        if (s.revisionId === revisionId) {
          state = historyCtrl.undo(idx + 1);
          break;
        }
      }
      return state;
    },
    jumpToRevision: (revisionId: string): void | Readonly<S> => {
      // is revisionId the current state? -> return current state
      if (history.current.revisionId === revisionId) {
        return history.current;
      }
      // is revisionId in the past?
      const pastState = historyCtrl.jumpToPastRevision(revisionId);
      if (pastState && pastState.revisionId === revisionId) {
        return pastState;
      }
      // is revisionId in the future?
      const futureState = historyCtrl.jumpToFutureRevision(revisionId);
      if (futureState && futureState.revisionId === revisionId) {
        return futureState;
      }
    },
    redo: (steps = 1): Readonly<S> => {
      // shift everything `steps` forward
      if (steps >= 1 && history.future.length >= steps) {
        const idx = steps - 1;
        const newCurrent = history.future[idx];
        const originalCurrent = history.current;
        history.current = newCurrent;
        const futureSliceToPast = history.future.slice(0, idx);
        history.future = history.future.slice(steps, history.future.length);
        history.past.unshift(...[originalCurrent, ...futureSliceToPast].reverse());
        pruneHistory<T, S>(history, limit);
      }
      return history.current;
    },
    setState: (value: T) => {
      const originalHistory = <History<T, S>>jsonObjectCopy<
        History,
        'past' | 'current' | 'future'
      >(history);
      try {
        history.current = <S>{
          revisionId: idFactory(value),
          value,
        };
        history.future = [];
        history.past.unshift(originalHistory.current);
        pruneHistory<T, S>(history, limit);
        return history.current;
      } catch(_: any) {
        // roll back
        history = originalHistory;
        return history.current;
      }
    },
    undo: (steps = 1): Readonly<S> => {
      // shift everything `steps` backward
      if (steps >= 1 && history.past.length >= steps) {
        const idx = steps - 1;
        const newCurrent = history.past[idx];
        const originalCurrent = history.current;
        history.current = newCurrent;
        const pastSliceToFuture = history.past.slice(0, idx);
        history.past = history.past.slice(steps, history.past.length);
        history.future.unshift(...[originalCurrent, ...pastSliceToFuture].reverse());
        pruneHistory<T, S>(history, limit);
      }
      return history.current;
    },
  };
  
  return historyCtrl;
}
