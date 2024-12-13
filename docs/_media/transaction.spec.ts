import {
  expect as chaiExpect,
} from 'chai';
import {
  createTransaction,
} from './transaction';
import {
  AnyObject,
} from '../types';
import { randomString } from '../utils';

// Contrived ETL example middleware
export const extractMiddleware = (api: AnyObject) => {
  const { type } = api.action;

  return (middleware: any) => {
    return (params: any) => {
      const {
        action,
        state,
      } = params;

      if (type === 'TRANSACTION_COMMIT') {
        if (action.type === 'REFORMAT_OBJECT') {
          const keys  = [state.value.source.data.strings[0], state.value.source.data.strings[2]];
          const values  = [state.value.source.data.strings[1], state.value.source.data.strings[3]];
          return middleware({ action: {
            type: action.type,
            data: { keys, values },
          }, state });
        }
      } else if (type === 'TRANSACTION_ROLLBACK') {
        if (action.type === 'REFORMAT_OBJECT') {
          return middleware(params);
        }
      } else {
        return middleware(params);
      }
    };
  };
};

export const transformMiddleware = (api: AnyObject) => {
  const { type } = api.action;

  return (middleware: any) => {
    return (params: any) => {
      const {
        action,
        state,
      } = params;

      if (type === 'TRANSACTION_COMMIT') {
        if (action.type === 'REFORMAT_OBJECT') {
          const data = {
            [action.data.keys[0]]: action.data.values[0],
            [action.data.keys[1]]: action.data.values[1],
          }
          return middleware({
            carlo: 'test',
            action: {
              type: action.type,
              data,
            },
            state,
          });
        }
      } else if (type === 'TRANSACTION_ROLLBACK') {
        if (action.type === 'REFORMAT_OBJECT') {
          return middleware(params);
        }
      } else {
        return middleware(params);
      }
    };
  };
};

export const loadMiddleware = (api: AnyObject) => {
  const { type } = api.action;

  return (middleware: any) => {
    return (params: any) => {
      const {
        action,
        state,
      } = params;

      if (type === 'TRANSACTION_COMMIT') {
        if (action.type === 'REFORMAT_OBJECT') {
          return middleware({ action, state: {
            value: {
              source: state.value.source,
              target: action.data,
            }
          } });
        }
      } else if (type === 'TRANSACTION_ROLLBACK') {
        if (action.type === 'REFORMAT_OBJECT') {
          return middleware(params);
        }
      } else {
        return middleware(params);
      }
    };
  };
};


describe('transaction', () => {
  const action = {
    type: 'REFORMAT_OBJECT',
  }

  let source: AnyObject, target: AnyObject, keyOne: string,
    keyTwo: string, valueOne: string, valueTwo: string, contrivedEtl: any,
    state: AnyObject;

  beforeEach(() => {
    keyOne = randomString();
    valueOne = randomString();
    keyTwo = randomString();
    valueTwo = randomString();

    source = {
      data: {
        strings: [keyOne, valueOne, keyTwo, valueTwo],
      }
    };
    target = {
      values: [],
    };

    state = {
      revisionId: 'test',
      value: {
        source,
        target,
      },
    };

    contrivedEtl = createTransaction({
      middleware: [
        {
          middleware: extractMiddleware,
        },
        {
          middleware: transformMiddleware,
        },
        {
          middleware: loadMiddleware,
        },
      ],
    });

  });

  it('should instantiate', async () => {
    chaiExpect(createTransaction()).to.be.not.null;
  });

  it('should process commit chain', async () => {
    const extracted = contrivedEtl(state, action);
    const result = extracted.commit();

    chaiExpect(result.state.value.target).to.have.keys(keyOne, keyTwo);
  });

  it('should process rollback chain', async () => {
    const extracted = contrivedEtl(state, action);
    const result = extracted.rollback();

    chaiExpect(result.state.value.target.values.length).to.eq(0);
  });
});