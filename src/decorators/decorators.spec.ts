import {
  expect as chaiExpect,
} from 'chai';
import {
  noop,
} from '../combinators';
import {
  passthroughMiddleware,
} from '../middleware';
import type {
  Callable,
  ConstructorFunction,
} from '../types';
import {
  createClassDecorator,
  createClassHandler,
  createClassMemberDecorator,
  createClassMethodHandler,
  createClassParameterHandler,
  createClassPropertyHandler,
  createDecorator,
} from './decorators';

describe('Decorators', () => {
  const middleware = [
    { 
      middleware: (api: any) => {
        return (middleware: Callable<any[], any>) => {
          return (params: any) => {
            noop('logger', { api, middleware, params });
            return middleware(params);
          };
        }
      },
    },
    { 
      middleware: passthroughMiddleware
    },
  ]
  
  const classCallback = (params: any) => {
    const {
      api,
      target,
    } = params;
    const test = () => {
      return api().middleware('test');
    };
    const cb = (t: any) => t.prototype.test = test;
    createClassHandler(cb)(target);
  };
  
  const classMethodCallback = (params: any) => {
    const {
      target,
      propertyKey,
      descriptor,
    } = params;
    const value = (..._: any[]) => {
      return 'overridden';
    }        
    createClassMethodHandler({
      newDescriptor: { value },
    })(
      target,
      propertyKey,
      descriptor
    );
  };
  
  const classPropertyCallback = (params: any) : void => {
    const {
      target,
      propertyKey,
    } = params;
    createClassPropertyHandler({
      accessors: {
        get: () => 'overridden',
        set: (_: any) => { return },
      },
    })(target, propertyKey);
  };
  
  const classParameterCallback = (params: any) : void => {
    const {
      target,
      parameterIndex,
      propertyKey,
    } = params;
  
    createClassParameterHandler(
      noop
    )(
      target,
      propertyKey,
      parameterIndex
    );
  };

  describe('createDecorator', () => {
    it('should create a class decorator', async () => {
      const ClassDecorator = createDecorator<
        ConstructorFunction,
        any,
        void | FunctionConstructor
      >({
        callback: classCallback,
        middleware,
      });

      @ClassDecorator
      class Test {
        constructor() {}
      }

      const testInstance = new Test();
      /* @ts-expect-error ts2556 */
      chaiExpect(typeof testInstance.test).to.eq('function');
      /* @ts-expect-error ts2556 */
      chaiExpect(testInstance.test()).to.eq('test');
    });

    it('should create a method decorator', async () => {
      const ClassMethodDecorator = createDecorator<
        any,
        any,
        TypedPropertyDescriptor<(..._: any[]) => string>
      >({
        callback: classMethodCallback,
        middleware,
      });

      class Test {
        @ClassMethodDecorator
        methodOne() {
          return 'methodOne';
        }
      }

      const testInstance = new Test();
      chaiExpect(typeof testInstance.methodOne).to.eq('function');
      chaiExpect(testInstance.methodOne()).to.eq('overridden');
    });

    it('should create a property decorator', async () => {      
      const ClassPropertyDecorator = createDecorator<
        any, any, void
      >({
        callback: classPropertyCallback,
        middleware,
      });

      class Test {
        @ClassPropertyDecorator
        declare val : string;
      }

      const testInstance = new Test();
      chaiExpect(testInstance.val).to.eq('overridden');
      testInstance.val = 'test';
      chaiExpect(testInstance.val).to.eq('overridden');
    });

    /**
     * NOTE: Parameter decorators are more involved in that you are only given
     *  the parameter name and index. To fully utilize this is out of the scope
     *  of my current needs. More coming in later versions. 
     */
    it('should create a parameter decorator', async () => {
      const ClassParameterDecorator = createDecorator<any, any, void>({
        callback: classParameterCallback,
        middleware,
      });

      class Test {
        testMethod(@ClassParameterDecorator param: any) {
          noop('testMethod for params', param);
        }
      }

      const testInstance = new Test();
      chaiExpect(typeof testInstance.testMethod).to.eq('function');
    });
  });

  describe('createClassDecorator', () => {
    it('should create a class decorator', async () => {
      const ClassDecorator = createClassDecorator({
        callback: classCallback,
        middleware,
      });

      @ClassDecorator
      class Test {
        constructor() {}
      }
      
      const testInstance = new Test();
      /* @ts-expect-error ts2556 */
      chaiExpect(typeof testInstance.test).to.eq('function');
      /* @ts-expect-error ts2556 */
      chaiExpect(testInstance.test()).to.eq('test');
    });
  });

  describe('createClassMethodDecorator', () => {
    it('should create a class method decorator', async () => {
      const ClassMethodDecorator = createClassMemberDecorator({
        callback: classMethodCallback,
        middleware,
      });

      class Test {
        @ClassMethodDecorator
        methodOne() {
          return 'methodOne';
        }
      }

      const testInstance = new Test();
      chaiExpect(typeof testInstance.methodOne).to.eq('function');
      chaiExpect(testInstance.methodOne()).to.eq('overridden');
    });
  });

  describe('createClassPropertyDecorator', () => {
    it('should create a class property decorator', async () => {
      const ClassPropertyDecorator = createClassMemberDecorator({
        callback: classPropertyCallback,
        middleware,
      });

      class Test {
        @ClassPropertyDecorator
        declare val : string;
      }

      const testInstance = new Test();
      chaiExpect(testInstance.val).to.eq('overridden');
      testInstance.val = 'test';
      chaiExpect(testInstance.val).to.eq('overridden');
    });
  });

  /**
   * NOTE: Parameter decorators are more involved in that you are only given
   *  the parameter name and index. To fully utilize this is out of the scope
   *  of my current needs. More coming in later versions. 
   */
  describe('createClassParameterDecorator', () => {
    it('should create a class parameter decorator', async () => {
      const ClassParameterDecorator = createClassMemberDecorator({
        callback: classParameterCallback,
        middleware,
      });

      class Test {
        testMethod(@ClassParameterDecorator param: any) {
          noop('testMethod for params', param);
        }
      }

      const testInstance = new Test();
      testInstance.testMethod('testty');
      chaiExpect(typeof testInstance.testMethod).to.eq('function');
    });
  });
});
