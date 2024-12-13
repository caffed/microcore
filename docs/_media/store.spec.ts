import {
  expect as chaiExpect,
} from 'chai';
import type {
  Action,
  State,
} from '../types';
import {
  jsonObjectCopy,
  randomInteger,
  randomString,
} from '../utils';
import {
  type ReducerAction,
} from './reducer';
import {
  createStore,
} from './store';
import { 
  createHistory,
  createHistoryController,
} from './history';

const add: ReducerAction<number> = (state: State<number>, action: Action<number>) => {
  if (!state) {
    state = {
      revisionId: randomString(),
      value: 0,
    }
  }
  const newState = jsonObjectCopy<State<number>, "revisionId" | "value">(state);
  newState.value = Number(newState.value) + Number(action.data);
  return <State<number>>newState;
};

const reducers = {
  math: {
    add,
  }
}

describe('reducer/store', () => {
  let store: any, name: any, num: number;

  beforeEach(() => {
    name = randomString();
    num = <number>randomInteger();
    store = createStore({ name, reducers });
  });

  it('should instantiate', async () => {
    chaiExpect(store).to.not.be.null;
  });

  it('should get actions', async () => {
    const actions = store.actions;
    chaiExpect(Reflect.ownKeys(actions).length).to.eq(1);
    chaiExpect(Reflect.ownKeys(actions)).to.include('math/add');
  });


  describe('dispatch', () => {
    let futureRevision: any,
        futureValue: any,
        futureState: any,
        history: any,
        historyCtl: any,
        pastRevision: any,
        pastState: any,
        pastValue: any,
        prefix: any,
        revisionId: any,
        initialState: any,
        store: any,
        value: any;

    beforeEach(() => {
      value = randomString();
      revisionId = randomString();
      initialState = {
        revisionId,
        value,
      };
      futureRevision = randomString();
      futureValue = randomString();
      futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      };
      pastRevision = randomString();
      pastValue = randomString();
      pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      };
      history = createHistory<any>({
        past: [
          pastState,
        ],
        current: initialState,
        future: [
          futureState,
        ],
      });
      historyCtl = createHistoryController<string>({ history });

      prefix = randomString();
      store = createStore({
        historyCtl,
        options: {},
        reducers,
      });
    });

    it('should do nothing if reducer action is not found', async () => {
      historyCtl.clear();
      chaiExpect(store.getState()).to.eq(undefined);
      store.dispatch({
        type: randomString(),
        data: num,
      })
      chaiExpect(store.getState()).to.eq(undefined);
    });
  
    it('should perfom reducer action if found', async () => {
      historyCtl.clear();
      chaiExpect(store.getState()).to.eq(undefined);
      store.dispatch({
        type: 'math/add',
        data: num,
      })
      chaiExpect(store.getState().value).to.eq(num);
    });

    it('should log actions', async () => {
      historyCtl.clear();
      store = createStore({
        historyCtl,
        options: {
          logger: {
            prefix,
          },
        },
        reducers,
      });
      store.dispatch({
        type: 'math/add',
        data: num,
      })
      chaiExpect(store.getState().value).to.eq(num);
    });

    it('should clear history', async () => {
      store.dispatch({
        type: '@CLEAR',
      })
      chaiExpect(store.getState()).to.eq(undefined);
    });

    it('should jump to future revision', async () => {
      store.dispatch({
        type: '@JUMP_TO_FUTURE_REVISION',
        data: {
          revisionId: futureState.revisionId,
        }
      })
      chaiExpect(store.getState().revisionId).to.eq(futureState.revisionId);
    });

    it('should jump to past revision', async () => {
      store.dispatch({
        type: '@JUMP_TO_PAST_REVISION',
        data: {
          revisionId: pastState.revisionId,
        }
      })
      chaiExpect(store.getState().revisionId).to.eq(pastState.revisionId);
    });

    it('should jump to an arbitrary revision', async () => {
      [
        pastState.revisionId,
        revisionId,
        futureState.revisionId,
      ].forEach((id: string) => {
        store.dispatch({
          type: '@JUMP_TO_REVISION',
          data: {
            revisionId: id,
          }
        })
        chaiExpect(store.getState().revisionId).to.eq(id);
      });
    });

    it('should redo action', async () => {
      store.dispatch({
        type: '@REDO',
        data: {
          steps: 1,
        }
      })
      chaiExpect(store.getState().revisionId).to.eq(futureState.revisionId);
    });

    it('should undo action', async () => {
      store.dispatch({
        type: '@UNDO',
        data: {
          steps: 1,
        }
      })
      chaiExpect(store.getState().revisionId).to.eq(pastState.revisionId);
    });
  });

  it('should have a an empty initial state', async () => {
    chaiExpect(store.getState()).to.eq(undefined);
  });

  it('should have a name', async () => {
    chaiExpect(store.name).to.eq(name);
  });

  it('should be able to subscribe to updates', async () => {
    const cb: jest.Mock<(value: any) => any> = jest.fn(value => value);
    store.subscribe(cb);
    store.dispatch({
      type: 'math/add',
      data: num,
    })
    expect(cb).toHaveBeenCalled();
  });

  it('should be able to unsubscribe to updates', async () => {
    const cb: jest.Mock<(value: any) => any> = jest.fn(value => value);
    const unsubscribe = store.subscribe(cb);
    unsubscribe();
    store.dispatch({
      type: 'math/add',
      data: num,
    });
    expect(cb).not.toHaveBeenCalled();
  });

});