# micro*core*
## A '<i>framework</i>' framework.

## About
- Why?
  - I prefer smaller frameworks that allow for open ended extension with less dependencies to use for my own projects.
  - Also, why not? 🤷
- What?
  - This project follows the 80/20 adage in supporting 20% of the features you use 80% of the time and will never be as featureful as dedicated projects for specific domains.
  - Most modules provide an API with middleware for extension.
- How?
  - Currently, the best documentation is the source and tests in this package. As time permits, I will add more verbose documentation and examples.  


## Documentation

- This is a collection of APIs mostly designed to be used together. The two main sources of documentation are this [README.md](./README.md) and the [Typedoc generated](./docs/globals.md) documentation.
- This readme is meant to be an <strong>overview</strong> of this project while the documentation will be expanded at a later date.


#### Goals/Caveats:
- The goal of this project is to be as small as possible.
- API cronstructors provide a standard API and middleware extension framework. Specific use case functionality is supposed to use 'userland' middleware for implementation. 
- The targeted interpreters are node, browsers and Electron. Deno will be verified in the future.


## Modules

### Cache

- The cache module provides the `Cache<K, V>` interface and two implementations: `MapCache<K, V>` class and `createMapCache<K, V>` constructor.
- The `MapCache` class provides a simple implementation of the interface using a `Map<K, V>` to store values.
- The `createMapCache` constructor implements middleware so that each method, except the name getter, can be extended via middleware. The last middleware in the chain is `./cache/middleware.ts` and provides baseline cache method functionality.
- For more detail, see [source](./src/cache/cache.ts), [middleware](./src/cache/middleware.ts) and [tests](./src/cache/cache.spec.ts).

#### MapCache Class Example:

```typescript
// Not meant to be a complete example

import { MapCache } from '@caffedpkg/microcore';

type CustomType = {
  // typedef here
};

const mapCacheClassInstance = new MapCache<string, CustomType>();
const key = 'key';
const valueOne: CustomType = {};
mapCacheClassInstance.setValue(key, valueOne);
mapCacheClassInstance.hasValue(key) // true
```

#### createMapCache Constructor Example:

```typescript
// Not meant to be a complete example

import { CACHE_ACTIONS, createMapCache } from '@caffedpkg/microcore';


type CustomType = {
  // typedef here
};

const myHashingFunction = (input) => {
  // logic here: MD5, SHA256 etc
};

const cacheKey = (hashingFunction: typeof Function) => {
  return (api: Record<any, any>) => {
    const { type } = api?.action;

    return (middleware: any) => {
      return (params: Record<any, any>) => {
        if (type === CACHE_ACTIONS.CACHE_SET_VALUE) {
          const hashKey = hashingFunction(value);
          return middleware({ key: `${key}-${hashkey}`, value });
        }
        return middleware(params);
      };
    };
  };
};

const mapCacheInstance = createMapCache<string, CustomType>({
  middleware: [{ middleware: cacheKey(myHashingFunction) }],
});

const key = 'key';
const valueOne: CustomType = {};
mapCacheInstance.setValue(key, valueOne);
```

### Combinators

  - This is a collection of common functional combinators and are still heavily WIP.
  - Not yet recommended for use.
  - These will eventually allow for easy typing and code block integration.
  - For more detail, see [source](./src/combinators/combinators.ts) and [tests](./src/combinators/combinators.spec.ts).


### Decorators

  -  This is a convenience API based off of the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/decorators.html) documentation for decorators.
  - This implementation provides a `Decorator<T, V, R>`, type as well as a universal `createDecorator<T, V, R>` constructor with convenience constructors for each type of decorator.
  - This decorator API supports middleware for constructors so that functionality can be easily reused.
  - For more detailed examples, see decorator [test specs](./decorators/decorators.spec.ts).
  - For detailed parameter decorator implementations, see [TypeScript's Handbook](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators).
  - For more detail, see [source](./src/decorators/decorators.ts) and [tests](./src/decorators/decorators.spec.ts).

#### Class Decorator Example:

```typescript
// Not meant to be a complete example

import { createClassDecorator } from '@caffedpkg/microcore';

const myDecoratorMiddleware = () => {} // see middleware docs

const middleware = [{
  middleware: myDecoratorMiddleware,
}];

const callback = (params: Record<any, any>) => {
  const {
    api,    // the middleware api
    target, // the class prototype
  } = params;

  // decorator code here
  // target is mutated and there is no return
};

const MyClassDecorator = createClassDecorator({
  callback,
  middleware,
});

@MyClassDecorator
class Test {
  constructor() {}
}
```

#### Class Method Decorator Example:

```typescript
// Not meant to be a complete example

import { createClassMemberDecorator } from '@caffedpkg/microcore';

const myDecoratorMiddleware = () => {} // see middleware docs

const middleware = [{
  middleware: myDecoratorMiddleware,
}];

const callback = (params: Record<any, any>) => {
  const {
    api,          // the middleware api
    target,       // the class prototype
    propertyKey,  // the name of the method
    descriptor,   // The property descriptor of method definition
  } = params;


  // decorator code here
  // descriptor is mutated and there is no return
};

const MyClassMethodDecorator = createClassMemberDecorator({
  callback,
  middleware,
});

class Test {
  constructor() {}

  @MyClassMethodDecorator
  method() {}
}
```

#### Class Property Decorator Example:

```typescript
// Not meant to be a complete example

import { createClassMemberDecorator } from '@caffedpkg/microcore';

const myDecoratorMiddleware = () => {} // see middleware docs

const middleware = [{
  middleware: myDecoratorMiddleware,
}];

const callback = (params: Record<any, any>) => {
  const {
    api,          // the middleware api
    target,       // the class prototype
    propertyKey,  // the name of the method
  } = params;

  // decorator code here
  // property accessors are mutated and there is no return
  // Easiest approach is using `Reflect.defineProperty(target, propertyKey, { get, set })`
};

const MyClassPropertyDecorator = createClassMemberDecorator({
  callback,
  middleware,
});


class Test {
  // Initialization with assignment is currently not supported with TypeScript property decorators
  @MyClassPropertyDecorator
  declare val : string;
}
```

#### Class Method Parameter Decorator Example:

```typescript
// Not meant to be a complete example

import { createClassMemberDecorator } from '@caffedpkg/microcore';

const myDecoratorMiddleware = () => {} // see middleware docs

const middleware = [{
  middleware: myDecoratorMiddleware,
}];

const callback = (params: Record<any, any>) => {
  const {
    api,            // the middleware api
    parameterIndex, // parameter arity index
    propertyKey,    // the name of the method
  } = params;

  // decorator code here
  // no return
  // see https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators
};

const MyClassParameterDecorator = createClassMemberDecorator({
  callback,
  middleware,
});

class Test {
  method(@MyClassParameterDecorator param) {}
}
```

### HTTTPClient

  - The `HTTPClient<R>` constructor uses types made from MDN and RFC documentation (see source for links) and simplifies creating `fetch` based requests with middleware support for request and response handling.
  - There are additional convenience constructors for creating APIs based on `HTTPClient`: `clientFactory` (scoped by HTTP method) and `createHttpClient` (all HTTP methods).
  - For more detail, see [source](./src/httpclient/httpclient.ts) and [tests](./src/httpclient/httpclient.spec.ts).

#### HTTPClient Request Handling Example:

```typescript
// Not meant to be a complete example

import { HttpClient } from '@caffedpkg/microcore';

const myTokenGenerator = () => {};

const auth = (getToken: typeof Function) => {
  return (api: Record<any, any>) => {
    const { type } = api?.action;

    return (middleware: any) => {
      return (params: Record<any, any>) => {
        const {
          requestOptions,
        } = params;

        if (type === 'HTTP_REQUEST') {
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

const client = HttpClient({
  middleware: [{ middleware: auth(myTokenGenerator) }],
  requestInitOptions: {
    method: 'GET',
  },
  request: 'https://url',
});

await client()
  .then(resp => {
    console.log(resp.headers.get('Authorization')); // `Bearer: ${token}`
  });
```

#### HTTPClient Response Handling Example:

```typescript
// Not meant to be a complete example

import { HttpClient } from '@caffedpkg/microcore';

const myResponseParser = () => {};

const responseHandler = (api: Record<any, any>) => {
  const { type } = api?.action;

  return (middleware: any) => {
    return (params: Record<any, any>) => {
      const {
        result,
      } = params;

      if (type === 'HTTP_RESPONSE') {
        return myResponseParser(result);
      }
      return middleware(params);
    };
  };
};


const client = HttpClient({
  middleware: [{ middleware: responseHandler }],
  requestInitOptions: {
    method: 'GET',
  },
  request: 'https://url',
});

await client()
  .then(resp => {
    console.log(resp); // response was automatically handled by myResponseParser
  });
```

### Logger

  - This API provides the `createLogger<F>` constructor with middleware support for line creation and line logging.
  - The [default middleware](./logger/middleware.ts) provides JSON and string formatted support with `console.log` functionality. The `makeJsonLine` middleware automatically creates a SQLite compatible DATATIME timestamp for each logged line.

`[${YEAR}-${DAY}-${MONTH}T${HOUR}:${MINUTE}:${SECOND}:${MS} | ${LEVEL} | ${PREFIX}]: ${DATA}` 


  - Middleware can be written to support custom telemetry workflows as well.
  - For more detail, see [source](./src/logger/logger.ts), [middleware](./src/logger/middleware.ts)  and [tests](./src/logger/logger.spec.ts).

#### Logger Example:

```typescript
// Not meant to be a complete example

import { createLogger } from '@caffedpkg/microcore';

const myFormatter = () => {}; // see ./logger/middlerware.ts 

const logger = createLogger<string>({
  formatter: myFormatter,
  prefix: 'Custom Prefix',
});

logger.log('test')
> [2049-04-4T12:00:00:000 | INFO | Custom Prefix]: test
```

### Matcher

  - This API provides the `createMatcher<A, B>` constructor with middleware support for extendable assertions. The intended use case is for data validation eg: form fields, etc.
  - The `createProxiedMatcher<A, B>` allows for a flexible micro-assertion library extendable via middleware. This throws for any failure. These use cases might be less universally needed.
  - For more detail, see [source](./src/matcher/matcher.ts) and [tests](./src/matcher/matcher.spec.ts).

#### Matcher Example:

```typescript
// Not meant to be a complete example

import { createMatcher } from '@caffedpkg/microcore';

const assertTrue = (_: any) => {
  return (_: any) => {
    return (...params: any[]) => {
      return params[0] === params[1];
    };
  }
};

type MyInputTypes = string | number;

const assertTrueMatcher = createMatcher<number | string>({
  middleware: [{ middleware: assertTrue }],
});

assertTrueMatcher('test', 'test') // true
assertTrueMatcher(false, 'false') // type error and also false 
```


#### Proxied Matcher Example:

```typescript
// Not meant to be a complete example

import { createProxiedMatcher } from '@caffedpkg/microcore';

const assertTrue = (_: any) => {
  return (_: any) => {
    return (...params: any[]) => {
      return params[0] === params[1];
    };
  }
};

const proxiedMatcher = createProxiedMatcher<number | string>({
  defaultTarget: {},
  methodName,
  middleware: [{ middleware: assertTrue }],
});

// matcher
proxiedMatcher.match(true, true);

// seperate expect() chain added, see source for features
proxiedMatcher.expect(true).to.eq(true);
proxiedMatcher.expect(true).to.be.true;
```


### Middleware

  - This API provides a generic way to add middleware to any project. It is based on the apply/A+compose/B combinator approach that [Redux uses](https://github.com/reduxjs/redux/blob/master/src/applyMiddleware.ts).
  - This main entrypoint for this API is `createMiddlewareApi<T, R>` as it provides defaults for all parameters not passed in. If you want more control or a simpler implementation, use `applyMiddleware<T, R>` instead.
  - For more detail, see [source](./src/middleware/middleware.ts) and [tests](./src/middleware/middleware.spec.ts).
  - <strong>NOTE:</strong> The types/generics in this API might change in the future.


#### createMiddlewareApi Example:

```typescript
// Not meant to be a complete example

import { createMiddlewareApi } from '@caffedpkg/microcore';

// API object constructor
const createApi = (...args) => {
  return {
    myOtherFunction() {},
    middleware() {}, // added to middleware chain
  };
};

// Array of middleware
const middleware =  [{
  data: {}, // to be used in transform for sorting, reshaping etc
  middleware: myMiddleWare,
}];

// compare function: (a, b) => -1, 0, 1
const sort = () => {};

// An Array.prorotype.reduce callback function
//  allows for arbitrary reshaping of the array of middleware.
const transform = (accumulator, current, index, array) => {};

// - Each one of these parameters has a corresponding
//   passthrough default if not provided
// - `middleware` is the only one really needed for most use cases
const api = createMiddlewareApi({
  createApi,
  middleware,
  sort,
  transform,
});

const result = api.middleware(args);
```

### React utils

  - The one thing currently provided in `mountRootComponent` which handles bootstrapping the root React component into the `document.body`.
  - For more detail, see [source](./src/react/loader.tsx) and [tests](./src/react/loader.spec.tsx).


#### mountRootComponent Example:

```typescript
// Not meant to be a complete example

import { mountRootComponent } from '@caffedpkg/microcore';
import { App } from './App';

const logger = () => {};
const renderFunc = () => {};

mountRootComponent({
  Component: App,
  logger, // optional. for error reporting. console.warn is default.
  renderFunc, // optional. handles mounting root component. defaults to React 18.x boilerplate. 
  rootElement: '#content-root', // CSS selector string or HTMLElement reference of root HTMLElement
});
```

### Reducer

  - There are three APIs: `createHistory`, `createReducer`, and `createStore`. The history and reducer APIs are self contained while the store API combines them together.
  - The `createHistoryController<T, S>` API manages a `History<T, S>` instance with storing states in the `past`, `current` and `future`.
  - The `createReducer<T, S>` API manages a `ReducerAction<T, S, A>` collection. This can be reused in different stores for composable functionality.
  - The `createStore<T, S, A>` API combines a history controller and reducer collection to dispatch actions to. By default `undo`, `redo` and `jumpToRevision` are supported.
  - States have at least a `revisionId` and `value` property and actions have at least a `type`.
  - For more detail, see
    - History: [source](./src/reducer/history.ts) and [tests](./src/reducer/history.spec.ts). 
    - Reducer: [source](./src/reducer/reducer.ts) and [tests](./src/reducer/reducer.spec.ts).
    - Store: [source](./src/reducer/store.ts), [middleware](./src/reducer/middleware.ts) and [tests](./src/reducer/store.spec.ts).

#### Store actions Example:

```typescript
const reducers = {
  math: {
    add: numberAdd(state, action) => state,
  },
  strings: {
    add: stringAdd(state, action) => state,
  }
}

// results in actionOne = { type: 'math/add' }, and actionTwo = { type: 'strings/add' }
```

#### createHistoryController Example:

```typescript
// Not meant to be a complete example

import { createHistoryController } from '@caffedpkg/microcore';

// can be pre-seeded with data
const history = {
  past: [],
  current: null,
  future: [],
};

const historyController = createHistoryController({ history });
```

#### createReducer Example:

```typescript
// Not meant to be a complete example

import { createReducer } from '@caffedpkg/microcore';

const addAction = (state, action) => state;

const actions = {
  'ADD': addAction,
};

type MyStateValueType = {
  // fields
};

const reducer = createReducer<MyStateValueType>({
  actions,
});
```

#### createStore Example:

```typescript
// Not meant to be a complete example

import { createStore } from '@caffedpkg/microcore';

const reducers = {
  math: {
    add: numberAdd, // (state, action) => state,
  },
  strings: {
    add: stringAdd, // (state, action) => state,
  }
}

const reducer = createStore({
  reducers,
});

const result = store.dispatch({
  type: 'math/add',
  data: {},
});
```

### Resource

  - The resource API is for creating dynamically generated resource URLs for use with Workers and other frameworks that require URLs for construction.
  - There are two stand alone constructors `createTextResource` and `createResource` with the main difference in that `createTextResource` is restricted to all 'text/*' mime types and returns a tag function for string template setup and `createResource` returns a curried function for default plus instance param merging.
  - There is also a `ResourceController` which is a singleton controller designed to manage all resources per JavaScript realm.
  - For more detail, see [source](./src/resource/resource.ts) and [tests](./src/resource/resource.spec.ts).

#### createTextResource Example:

```typescript
// Not meant to be a complete example

import { createTextResource } from '@caffedpkg/microcore';

const factory = x => x;
const name = 'test';

const textResource = createTextResource({
  factory, // optional. used for any custom resource content formatting.
  mimeType: 'text/javascript',
  name, // optional. the name of the resource.
})`
self.addEventListener('message', () => { console.log('i am being used for a Worker.'); });
`;

const worker = new Worker(textResource.url);
```

#### createResource Example:

```typescript
// Not meant to be a complete example

import { createResource } from '@caffedpkg/microcore';

const factory = x => x;
const name = 'test';
const data = `self.addEventListener('message', () => { console.log('i am being used for a Worker.');`;

// Passing default parameters
const workerScript = createResource({
  factory, // optional. used for any custom resource content formatting.
  mimeType: 'text/javascript',
  name, // optional. the name of the resource.
});

const resource = workerScript({ data });
const worker = new Worker(resource.url);
```


#### ResourceController Example:

```typescript
// Not meant to be a complete example

import { ResourceController } from '@caffedpkg/microcore';

const factory = x => x;
const name = 'test';
const data = `self.addEventListener('message', () => { console.log('I am being used for a Worker.');`;

const resourceController = new ResourceController();

const resource = resourceController.create({
  data,
  factory,
  mimeType: 'text/javascript',
  name,
});

const worker = new Worker(resource.url);
resourceController.delete(name);
const workerTwo = new Worker(resource.url); // will now fail
```

### Transaction

  - This API is inspired by the combination of state reducer and database transaction patterns. Each stage in the transaction chain is handled by a middleware handler with data flowing throw them like a state reducer - state and action. Commit processes the steps in forward order while rollback() processes in reverse order to return related entities back into the origin state.
  -  Each middleware should account for handling both `TRANSACTION_COMMIT` and `TRANSACTION_ROLLBACK` middleware actions.
  - For more detail, see [source](./src/transaction/transaction.ts) and [tests](./src/transaction/transaction.spec.ts).

#### Transaction Example:

```typescript
// Not meant to be a complete example

import {
  type Action,
  type State,
  createTransaction,
} from '@caffedpkg/microcore';

const state: State<T> = {};
const action: Action<T> = {}; 
const middleware = []; // your transaction handling middleware

const createTxRunner = createTransaction({
  middleware,
});

const runner = createTxRunner(state, action);

try {
  runner.commit();
} catch(_: any) {
  runner.rollback();
}
```

### URLManager

  - The URLManager class is a small extension of the existing [URL interface](https://developer.mozilla.org/en-US/docs/Web/API/URL) to track generated object URLs from `URL.createObjectUrl`. 
  - It also adds a convenience get/set for search params as `Record<string, string>`.
  - There is also a convenience static property `currentUrl` which returns a `URLManager` instance of `globalThis.location.href`.
  - For more detail, see [source](./src/urlmanager/urlmanager.ts) and [tests](./src/urlmanager/urlmanager.spec.ts).

#### URLManager Examples:

```typescript
// Not meant to be a complete example

import { URLManager } from '@caffedpkg/microcore';

const blob = new Blob(['test'], { type 'text/plain' });

const url = URLManager.createObjectUrl(blob);
URLManager.objectUrls.includes(url); // true

// currentUrl
const currentUrl = URLManager.currentUrl;

// params
const url = new URLManager('https://domain?key=val');
console.log(url.params);
> {
>   key: 'val',
> }

url.params = { key: 'valTwo' };
console.log(url.href);
> 'https://dommain?key=valTwo'
```

### Utils

  - This is a collection of functions mostly to support other APIs. These are tested but highly in flux. The rest will be documented in future versions when they are stabilized.
  - For more detail, see [source](./src/utils/utils.ts) and [tests](./src/utils/utils.spec.ts).


#### Utils Examples:

```typescript
// Not meant to be a complete example

import { randomInteger, randomString } from '@caffedpkg/microcore';

const num = randomInteger(); // default 4 digits
typeof num === 'number';
const numTwo = randomInteger(20, { bigint: true });
typeof numTwo === 'bigint';
const str = randomString(); // default 10 characters
typeof str === 'string';
const strTwo = randomString(100);
typeof strTwo === 'string';
strTwo.length === 100; // true
```

### Types

  - These are convenience types to support APIs here and in other projects.
  - For more detail, see [source](./src/types.ts).

```typescript
// Not meant to be a complete example

import type {
  AnyObject,
  ArrowFunction,
  Callable,
  Constructable,
  ConstructorFunction,
  MimeType,
} from '@caffedpkg/microcore';

// AnyObject<any> is essentially the same as Record<any, any>
const obj: AnyObject = {};

// ArrowFunction is a union type of all arrow function signatures
const myFunc = (callback: ArrowFunction): void => {};

// Callable is a conditional type used for defining arrow function signatures
// Constructable is a conditional type used for defining function constructor signatures
type MyType<R> = {
  callback: Callable<[first: FirstParamType, second: SecondParamType], any>;
  constructor: Constructable<any, R>;
}

// ConstructorFunction is a union type of all constructor function signatures
const myFunc = (constructor: ConstructorFunction): void => new constructor();

// MimeType is a string template type that constrains mime type strings to mostly valid
const mimeType: MimeType = 'image/png';
const badMimeType: MimeType = 'string/text';
```


## Roadmap

##### NOTE: This project will follow semver guidelines


- 0.1.0
  - First alpha release
- 0.2.0
  - Bug fixes.
  - The rest of the roadmap completed

## Contributing

- Currently, this package is for my project needs so large changes will be ignored.

- Please see the [contributing guidelines](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md) for more information regarding submitting feature requests and bugs.


## License

Licensed under the MIT License, Copyright © 2022-present Carlo Mogavero.

See [LICENSE](./LICENSE) for more information.