import {
  expect as chaiExpect,
} from 'chai';
import {
  createLogger,
} from './logger';
import { randomString } from '../utils';

describe('Logger', () => {
  let logger: any, mock: any, mockLog: any, str: string;
  beforeEach(() => {
    str = randomString();
    mock = jest.fn(() => {});
    mockLog = (_: any) => {
      return (_: any) => {
        return (_: any) => {
          return mock();
        };
      }
    };
    logger = createLogger({ middleware: [{ middleware: mockLog }]})
  });

  it('should instantiate', async () => {
    chaiExpect(logger).to.be.not.null;
  });

  it('should log parameters', async () => {
    logger.log(str);
    expect(mock).toHaveBeenCalled();
  });

  it('should have runtime properties update', async () => {
    const formatter = jest.fn((..._: any[]) => randomString());
    const level = 'info';
    const prefix = randomString();
    const output = jest.fn((..._: any[]) => randomString());

    mockLog = (api: any) => {
      return (middleware: any) => {
        return (params: any) => {
          if (api.action.type === 'LOGGER_CREATE_LINE') {
            const {
              lineOptions,
            } = params;
    
            formatter(lineOptions.prefix, lineOptions.level);
            output();
          }

          return middleware(params);
        };
      }
    };

    logger = createLogger({ middleware: [{ middleware: mockLog }]})

    logger.updateOptions({
      formatter,
      level,
      prefix,
      output,
    });

    logger.log(str);

    expect(formatter).toHaveBeenCalledWith(prefix, level);
    expect(output).toHaveBeenCalled();
  });

});
