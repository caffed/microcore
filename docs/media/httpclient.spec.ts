import {
  expect as chaiExpect,
} from 'chai';
import fetchMock, {
  enableFetchMocks,
} from "jest-fetch-mock";
import {
  AnyObject,
} from "../types";
import {
  randomString,
} from "../utils";
import {
  clientFactory,
  createHttpClient,
  HttpClient,
  HTTPMethods,
 } from './httpclient';

enableFetchMocks();

// Covering for jest-dom
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);
    return controller.signal;
  };
}
if (!AbortSignal.any) {
  AbortSignal.any = (signals: AbortSignal[]) => {
    return signals[0];
  };
}

const testUrl = globalThis.location.href;

// Mock returns request as response
fetchMock.mockResponse(async (request: Request) => {
  const headers: AnyObject = {};

  for (const [key, val] of request.headers) {
    headers[key] = val;
  }

  const requestJson = request.clone();
  const body = JSON.stringify({
    request: requestJson,
    signal: request.signal,
    signalAborted: request.signal.aborted,
  });

  return {
    body,
    headers: {
      ...headers,
      'X-Test-Method-Response-Header': request.method.toString(),
    },
    status: 200,
    url: request.url,
  };
});

const auth = (getToken?: any) => {
  return (api: any) => {
    return (middleware: any) => {
      return (params: any) => {
        const {
          action,
        } = api;

        if (action?.type === 'HTTP_REQUEST') {
          const {
            requestOptions,
          } = params;
          const token = getToken(requestOptions);
          const init = requestOptions[1] || {};
          if (init.headers) {
            init.headers.set('Authorization', `Bearer: ${token}`);
          } else {
            init.headers = new Headers([['Authorization', `Bearer: ${token}`]]);; 
          }
          requestOptions[1] = init;
        }
        return middleware(params);
      };
    };
  };
};

const respDecorator = (api: any) => {
  return (middleware: any) => {
    return (params: any) => {
      const {
        action,
      } = api;

      if (action?.type === 'HTTP_RESPONSE') {
        const {
          result,
        } = params;

        return {
          ...result,
          ...{ decorated: true },
        };
      }
      return middleware(params);
    };
  };
};

describe('httpclient', () => {
  beforeEach(() => {
    fetchMock.doMock()
  })

  describe('HttpClient', () => {
    it('should instantiate', async () => {
      chaiExpect(HttpClient({ request: testUrl })).to.not.be.null;
    });

    describe('signal', () => {
      it('should use the default signal', async () => {
        const client = HttpClient({
          request: testUrl,
        });
        await client()
          .then(resp => {
            const body = JSON.parse(resp.body.toString());
            chaiExpect(body.signalAborted).to.be.false;
          });
      });

      it('should us a signal passed as parameter', async () => {
        const controller = new AbortController();
        controller.abort();
        const client = HttpClient({
          request: testUrl,
          requestInitOptions: {
            method: 'GET',
          },
        });
        try {
          await client()
            .then(resp => {
              const body = resp.body();
              chaiExpect(body.signalAborted).to.be.true;
            });
        } catch(err: any) {
          chaiExpect(err).to.throw;
        }
      });
    });

    describe('middleware', () => {
      it('should process request middleware', async () => {
        const token = randomString(20);
        const client = HttpClient({
          middleware: [{ middleware: auth(() => token) }],
          requestInitOptions: {
            method: 'GET',
          },
          request: testUrl,
        });
        await client()
          .then(resp => {
            const header = resp.headers.get('Authorization');
            chaiExpect(header).to.eq('Bearer: ' + token);
          });
      });

      it('should process response middleware', async () => {
        const client = HttpClient({
          middleware: [{ middleware: respDecorator }],
          requestInitOptions: {
            method: 'GET',
          },
          request: testUrl,
        });
        await client()
          .then(resp => {
            chaiExpect(resp.decorated).to.be.true;
          })
      });
    });

    describe('clientFactory', () => {
      it('should instantiate', async () => {
        const params = {
          request: testUrl,
        };
        const method = HTTPMethods.GET;
        const client = clientFactory(method, params);
        chaiExpect(client).to.not.be.null;
      });
    });

    describe('createHttpClient', () => {
      it('should instantiate', async () => {
        const params = {
          request: testUrl,
        };
        chaiExpect(createHttpClient(params)).to.not.be.null;
      });
    });
  });
});
