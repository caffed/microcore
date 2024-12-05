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
  createReducer,
  type ReducerAction,
  type Reducer,
  ReducerCollection,
} from './reducer';

describe('Reducer', () => {
  describe('createReducer', () => {
    let name: string,
        reducer: Reducer<number>;

    const addAction: ReducerAction<number> = (state: State<number>, action: Action<number>) => {
      const newState = jsonObjectCopy<State<number>, "revisionId" | "value">(state);
      newState.value = Number(newState.value) + Number(action.data);
      return <State<number>>newState;
    };

    const multAction: ReducerAction<number> = (state: State<number>) => {
      const newState = jsonObjectCopy<State<number>, "revisionId" | "value">(state);
      newState.value = Number(newState.value) * Number(newState.value);
      return <State<number>>newState;
    };

    const squareAction: ReducerAction<number> = (state: State<number>) => {
      const newState = jsonObjectCopy<State<number>, "revisionId" | "value">(state);
      newState.value = Number(newState.value) * Number(newState.value);
      return <State<number>>newState;
    };

    const actions: ReducerCollection<number> = {
      'MULTIPLY': multAction,
      'SQUARE': squareAction,
    }

    beforeEach(() => {
      name = randomString();
      reducer = createReducer<number>({ actions, name });
    });

    it('should instantiate', async () => {
      chaiExpect(reducer).to.not.be.null;
    });

    it('shoudl dispatch an action', async () => {
      const value = <number>randomInteger();
      const revisionId = randomString();
      const state: State<number> = {
        revisionId,
        value,
      };
      const action = {
        type: 'SQUARE'
      };
      const result = reducer.dispatch(state, action);
      chaiExpect(result.value).to.eq(value * value);
    });

    it('should get an action by name', async () => {
      const action = reducer.getAction('SQUARE');
      chaiExpect(action).to.eq(squareAction);
    });

    it('should get all actions', async () => {
      const actions = reducer.getAllActions();
      const keys = Reflect.ownKeys(actions);
      chaiExpect(keys).to.include('MULTIPLY');
      chaiExpect(keys).to.include('SQUARE');
      chaiExpect(keys.length).to.eq(2);
      chaiExpect(actions['MULTIPLY']).to.eq(multAction);
      chaiExpect(actions['SQUARE']).to.eq(squareAction);
    });

    it('should verify if an action exists', async () => {
      chaiExpect(reducer.hasAction('MULTIPLY')).to.be.true;
      chaiExpect(reducer.hasAction('SQUARE')).to.be.true;
      chaiExpect(reducer.hasAction(randomString())).to.be.false;
    });

    it('should have a name', async () => {
      chaiExpect(reducer.name).to.eq(name);
    });

    it('should remover an action by name', async () => {
      chaiExpect(reducer.hasAction('SQUARE')).to.be.true;
      reducer.removeAction('SQUARE');
      chaiExpect(reducer.hasAction('SQUARE')).to.be.false;
    });

    it('should remove all actions', async () => {
      const allActionNames = Reflect.ownKeys(reducer.getAllActions());
      allActionNames.forEach(name => {
        chaiExpect(reducer.hasAction(name)).to.be.true;
      });
      reducer.removeAllActions();
      allActionNames.forEach(name => {
        chaiExpect(reducer.hasAction(name)).to.be.false;
      });
    });

    it('should set an action', async () => {
      chaiExpect(reducer.getAction('ADD')).to.eq(undefined);
      reducer.setAction('ADD', addAction);
      chaiExpect(reducer.getAction('ADD')).to.eq(addAction);
    });

    it('should set multiple actions', async () => {
      chaiExpect(reducer.getAction('ADD')).to.eq(undefined);
      reducer.setActions({'ADD': addAction});
      chaiExpect(reducer.getAction('ADD')).to.eq(addAction);
    });
  });
});