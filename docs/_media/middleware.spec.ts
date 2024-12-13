import {
  expect as chaiExpect,
} from 'chai';
import {
  noop,
} from '../combinators';
import {
  randomInteger,
  randomString,
} from '../utils';
import {
  applyMiddleware,
  compose,
  createMiddlewareApi,
} from './middleware';

const logger = (api: any) => {
  return (middleware: any) => {
    return (params: any) => {
      noop('logger', { api, params, middleware });
      return middleware(params);
    };
  }
};

const adder = (_: any) => {
  return (middleware: any) => {
    return (params: any) => {
      if (params?.adder && params.adder instanceof Array) {
        return params.adder.reduce((p: number, c: number) => { return p + c });
      } else {
        return middleware(params);
      }
    };
  }
};

const createApi = (..._: any[]) => {
  return {
    middleware: (a: any) => {
      if (a && typeof a === 'object' && a.test) {
        return a.test();
      }
      return a;
    },
    other: () => {
      return 42;
    }
  }
};

describe('middleware', () => {
  describe('applyMiddleware', () => {
    it('should instantiate', async () => {
      chaiExpect(applyMiddleware()).to.not.be.null;
    });

    it('should apply one middleware', () => {
      const applied = applyMiddleware(adder);
      chaiExpect(applied).to.not.be.null;
      const api = applied(createApi)();
      chaiExpect(api).to.not.be.null;
      const num1 = <number>randomInteger();
      const num2 = <number>randomInteger();
      chaiExpect(api.middleware({ adder: [num1,num2] })).to.eq(num1 + num2);
    });

    it('should apply multiple middlewares', () => {
      const applied = applyMiddleware(adder, logger);
      chaiExpect(applied).to.not.be.null;
      const api = applied(createApi)();
      chaiExpect(api).to.not.be.null;
      const num1 = <number>randomInteger();
      const num2 = <number>randomInteger();
      chaiExpect(api.middleware({ adder: [num1,num2] })).to.eq(num1 + num2);
    });

    it('should apply middleware and call middleware with no params', () => {
      const applied = applyMiddleware(logger, adder);
      chaiExpect(applied).to.not.be.null;
      const api = applied(createApi)();
      chaiExpect(api.middleware()).to.not.be.null;
    });

    it('should apply middleware and still can use api', () => {
      const applied = applyMiddleware(logger, adder);
      chaiExpect(applied).to.not.be.null;
      const api = applied(createApi)();
      chaiExpect(api).to.not.be.null;
      const num1 = <number>randomInteger();
      const num2 = <number>randomInteger();
      const num3 = <number>randomInteger();
      chaiExpect(api.middleware({test: () => num3})).to.eq(num3)
      chaiExpect(api.middleware({ adder: [num1,num2] })).to.eq(num1 + num2);
      chaiExpect(api.other()).to.eq(42);
    });
  });

  describe('compose', () => {
    it('should instantiate', async () => {
      chaiExpect(compose()).to.not.be.null;
    });

    it('should compose multiple middleware', () => {
      chaiExpect(compose(logger, adder)).to.not.be.null;
    });
  });

  describe('createMiddlewareApi', () => {
    it('should instantiate', async () => {
      chaiExpect(createMiddlewareApi()).to.not.be.null;
    });

    describe('api', () => {
      it('should instantiate with no params', async () => {
        const api = createMiddlewareApi();
        chaiExpect(api()).to.not.be.null;
      });

      it('should instantiate with random params', async () => {
        const api = createMiddlewareApi();
        const params: any[] = [];
        await new Array(10).fill(0).forEach(_ => {
          params.concat(randomString());
        }); 
        chaiExpect(api(...params)).to.not.be.null;
      });
    });

    describe('api().middleware', () => {
      const add = (_: any) => {
        return (middleware: any) => {
          return (params: any) => {
            const { value } = params;
            return middleware({ value: value + value });
          };
        }
      };

      const mult = (_: any) => {
        return (middleware: any) => {
          return (params: any) => {
            const { value } = params;
            return middleware({ value: value * value });
          };
        }
      };

      it('should have default passthrough middleware', async () => {
        const api = createMiddlewareApi();
        const str = randomString();
        chaiExpect(api().middleware(str)).to.eq(str);
      });

      it('should sort by an arbitrary value', async () => {
        const middleware: any[] = [
          {
            data: {
              priority: 1,
            },
            middleware: add,
          },
          {
            data: {
              priority: 0,
            },
            middleware: mult,
          },
        ];
        const num = <number>randomInteger();
        const result = (num + num) * (num + num);
        const result2 = (num * num) + (num * num);
        const api = createMiddlewareApi({ middleware });
        
        chaiExpect(api().middleware({ value: num }).value).to.eq(result);

        const apiSorted = createMiddlewareApi({
          middleware,
          sort: (a: any, b: any) => {
            return a.data?.priority > b.data?.priority ? 1 : -1;
          },
        });
        
         chaiExpect(apiSorted().middleware({ value: num }).value).to.eq(result2);
      });

      it('should transform by an arbitrary value', async () => {
        const middleware: any[] = [
          {
            middleware: add,
          },
          {
            middleware: mult,
          },
        ];
        const num = <number>randomInteger();
        const result = (num + num) * (num + num);
        const result2 = (num * num) + (num * num);
        const api = createMiddlewareApi({ middleware });
        
        chaiExpect(api().middleware({ value: num }).value).to.eq(result);
        
        const apiSorted = createMiddlewareApi({
          middleware,
          sort: (a: any, b: any) => {
            return a.data?.priority > b.data?.priority ? 1 : -1;
          },
        });
        
         chaiExpect(apiSorted().middleware({ value: num }).value).to.eq(result2);
      });
    });
  });
});
