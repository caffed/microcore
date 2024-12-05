import {
  expect as chaiExpect,
} from 'chai';
import type {
  AnyObject,
  State,
} from '../types';
import {
  randomString,
} from '../utils';
import {
  createHistory,
  createHistoryController,
  type History,
  type HistoryController,
} from './history';

describe('reducer/history', () => {
  describe('createHistory', () => {
    it('should instantiate', async () => {
      chaiExpect(createHistory()).to.not.be.null;
    });

    it('should return a valid history with initial state', async () => {
      const value = randomString();
      const revisionId = randomString();
      const state = {
        revisionId,
        value,
      };
      const history = createHistory<string>({ current: state });
      chaiExpect(history.current.revisionId).to.eq(revisionId);
      chaiExpect(history.current.value).to.eq(value);
    });
  });

  describe('createHistoryController', () => {
    let history: History<string>,
        historyCtl: HistoryController<string>,
        value: string,
        revisionId: string,
        initialState: State<string>;
    
    beforeEach(() => {
      value = randomString();
      revisionId = randomString();
      initialState = {
        revisionId,
        value,
      };
      history = createHistory<string>({ current: initialState });
      historyCtl = createHistoryController<string>({ history });
    });

    it('should instantiate', async () => {
      chaiExpect(createHistoryController()).to.not.be.null;
    });

    it('should clear history', async () => {
      chaiExpect(historyCtl.getState().value).to.eq(value);
      historyCtl.clear();
      chaiExpect(historyCtl.getState()).to.be.undefined;
    });

    it('should return a history', async () => {
      chaiExpect(Reflect.ownKeys(historyCtl.getHistory())).to.include('past');
      chaiExpect(historyCtl.getHistory().past).to.be.instanceOf(Array);
      chaiExpect(Reflect.ownKeys(historyCtl.getHistory())).to.include('current');
      chaiExpect(Reflect.ownKeys(historyCtl.getHistory())).to.include('future');
      chaiExpect(historyCtl.getHistory().future).to.be.instanceOf(Array);
    });

    it('should return a readonly history', async () => {
      const historyTwo = historyCtl.getHistory();
      historyTwo.current.value = randomString();
      chaiExpect(historyCtl.getHistory().current.value).to.eq(initialState.value);
    });

    it('should return the cirrent state', async () => {
      chaiExpect(historyCtl.getState()).to.not.be.null;
      chaiExpect(historyCtl.getState().value).to.eq(value);
      chaiExpect(historyCtl.getState().revisionId).to.eq(revisionId);
    });

    it('should jump to a future revision by id', async () => {
      const futureRevision = randomString();
      const futureValue = randomString();
      const futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      
      };

      history = createHistory<string>({
        current: initialState,
        future: [
          futureState,
        ],
      });

      historyCtl = createHistoryController<string>({ history });

      const jumpToFutureRevisionResult: AnyObject = historyCtl.jumpToFutureRevision(futureRevision) || {};
      chaiExpect(jumpToFutureRevisionResult.value).to.eq(futureValue);
      chaiExpect(jumpToFutureRevisionResult.revisionId).to.eq(futureRevision); 
    });

    it('should jump to a past revision by id', async () => {
      const pastRevision = randomString();
      const pastValue = randomString();
      const pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      
      };
      history = createHistory<string>({
        current: initialState,
        past: [
          pastState,
        ],
      });

      historyCtl = createHistoryController<string>({ history });

      const jumpToPastRevisionResult: AnyObject = historyCtl.jumpToPastRevision(pastRevision) || {};
      chaiExpect(jumpToPastRevisionResult.value).to.eq(pastValue);
      chaiExpect(jumpToPastRevisionResult.revisionId).to.eq(pastRevision); 
    });

    it('should jump to an arbitray revision by id', async () => {
      const pastRevision = randomString();
      const pastValue = randomString();
      const pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      };
      const futureRevision = randomString();
      const futureValue = randomString();
      const futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      };
      history = createHistory<string>({
        current: initialState,
        future: [
          futureState,
        ],
        past: [
          pastState,
        ],
      });
      historyCtl = createHistoryController<string>({ history });
      // current
      const jumpToCurrentRevisionResult: AnyObject = historyCtl.jumpToRevision(revisionId) || {};
      chaiExpect(jumpToCurrentRevisionResult.value).to.eq(value);
      chaiExpect(jumpToCurrentRevisionResult.revisionId).to.eq(revisionId); 
      chaiExpect(history.future.length).to.eq(1);
      chaiExpect(history.past.length).to.eq(1);
      // past
      const jumpToPastRevisionResult: AnyObject = historyCtl.jumpToRevision(pastRevision) || {};
      chaiExpect(jumpToPastRevisionResult.value).to.eq(pastValue);
      chaiExpect(jumpToPastRevisionResult.revisionId).to.eq(pastRevision);
      chaiExpect(history.future.length).to.eq(2);
      chaiExpect(history.past.length).to.eq(0);
      // future
      const jumpToFutureRevisionResult: AnyObject = historyCtl.jumpToRevision(futureRevision) || {};
      chaiExpect(jumpToFutureRevisionResult.value).to.eq(futureValue);
      chaiExpect(jumpToFutureRevisionResult.revisionId).to.eq(futureRevision);
      chaiExpect(history.future.length).to.eq(0);
      chaiExpect(history.past.length).to.eq(2);
    });

    it('should redo by a numeric value of future actions', async () => {
      const futureRevision = randomString();
      const futureValue = randomString();
      const futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      
      };

      history = createHistory<string>({
        current: initialState,
        future: [
          futureState,
        ],
      });

      historyCtl = createHistoryController<string>({ history });

      const currentState = historyCtl.getState();

      chaiExpect(currentState.revisionId).to.eq(revisionId);
      chaiExpect(currentState.value).to.eq(value);
      chaiExpect(currentState.revisionId).to.not.eq(futureRevision);
      chaiExpect(currentState.value).to.not.eq(futureValue);

      const redoState = historyCtl.redo();

      chaiExpect(redoState.revisionId).to.eq(futureRevision);
      chaiExpect(redoState.value).to.eq(futureValue);
      chaiExpect(redoState.revisionId).to.not.eq(revisionId);
      chaiExpect(redoState.value).to.not.eq(value);
      chaiExpect(historyCtl.getHistory().future.length).to.eq(0)
    });

    it('should set a new current state', async () => {
      const valueTwo = randomString();
      const setStateResult = historyCtl.setState(valueTwo);
      chaiExpect(setStateResult.value).to.eq(valueTwo);
    });

    it('should undo by a numeric value of past actions', async () => {
      const pastRevision = randomString();
      const pastValue = randomString();
      const pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      };

      history = createHistory<string>({
        current: initialState,
        past: [
          pastState,
        ]
      });

      historyCtl = createHistoryController<string>({ history });

      const currentState = historyCtl.getState();

      chaiExpect(currentState.revisionId).to.eq(revisionId);
      chaiExpect(currentState.value).to.eq(value);
      chaiExpect(currentState.revisionId).to.not.eq(pastRevision);
      chaiExpect(currentState.value).to.not.eq(pastValue);

      const undoState = historyCtl.undo();
      
      chaiExpect(undoState.revisionId).to.eq(pastRevision);
      chaiExpect(undoState.value).to.eq(pastValue);
      chaiExpect(undoState.revisionId).to.not.eq(revisionId);
      chaiExpect(undoState.value).to.not.eq(value);
      chaiExpect(historyCtl.getHistory().past.length).to.eq(0)
    });

    it('should limit past states', async () => {
      const pastRevision = randomString();
      const pastValue = randomString();
      const pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      };
      const futureRevision = randomString();
      const futureValue = randomString();
      const futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      };
      history = createHistory<string>({
        current: initialState,
        future: [
          futureState,
        ],
        past: [
          pastState,
        ],
      });
      const limit = 1;
      historyCtl = createHistoryController<string>({ history, limit });
      historyCtl.undo();
      chaiExpect(historyCtl.getHistory().future.length).to.eq(limit)
    }); 

    it('should limit future states', async () => {
      const pastRevision = randomString();
      const pastValue = randomString();
      const pastState = {
        revisionId:  pastRevision,
        value: pastValue,
      };
      const futureRevision = randomString();
      const futureValue = randomString();
      const futureState = {
        revisionId:  futureRevision,
        value: futureValue,
      };
      history = createHistory<string>({
        current: initialState,
        future: [
          futureState,
        ],
        past: [
          pastState,
        ],
      });
      const limit = 1;
      historyCtl = createHistoryController<string>({ history, limit });
      historyCtl.redo();
      chaiExpect(historyCtl.getHistory().past.length).to.eq(limit)
    }); 
  });
});
