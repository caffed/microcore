import {
  expect as chaiExpect,
} from 'chai';
import {
  AnyObject,
} from '../types';
import {
  randomInteger,
  randomString,
} from '../utils';
import {
  createMatcher,
  createProxiedMatcher,
} from './matcher';

// naive equal matcher
const assertTrue = (_: any) => {
  return (_: any) => {
    return (...params: any[]) => {
      return params[0] === params[1];
    };
  }
};

const assertTrueMatcher = createMatcher<number | string>({
  middleware: [{ middleware: assertTrue }],
});

describe('createMatcher', () => {
  it('should instantiate', async () => {
    const matcher = createMatcher();
    chaiExpect(matcher).to.not.be.null;
  });

  describe('assert equal', () => {
    it('should assert equality success', async () => {
      const num = randomInteger() as number;
      chaiExpect(assertTrueMatcher(num, num)).to.eq(true);
      const str = randomString();
      chaiExpect(assertTrueMatcher(str, str)).to.eq(true);
    });
    
    it('should assert equality failure', async () => {    
      const num = randomInteger() as number;
      chaiExpect(assertTrueMatcher(num, num + num)).to.eq(false);
      const str = randomString();
      chaiExpect(assertTrueMatcher(str, str.concat(str))).to.eq(false);
    });
  });
});

describe('makeProxiedMatcher', () => {
  let num: number, str: string, methodName: string, proxiedMatcher: AnyObject;

  beforeEach(() => {
    num = randomInteger() as number;
    str = randomString();
    methodName = randomString();
    proxiedMatcher = createProxiedMatcher<number | string>({
      defaultTarget: {},
      methodName,
      middleware: [{ middleware: assertTrue }],
    });
  });

  it('should provide: expect(actual).to.eq(expected)', async () => {
    proxiedMatcher.expect(true).to.eq(true);
    proxiedMatcher.expect(true).to.not.eq(false);
  });

  it('should provide: expect(actual).to.be.*', async () => {
    proxiedMatcher.expect([]).to.be.array;
    proxiedMatcher.expect(BigInt(randomInteger())).to.be.bigint;
    proxiedMatcher.expect(true).to.be.boolean;
    proxiedMatcher.expect(false).to.be.boolean;
    proxiedMatcher.expect(false).to.be.false;
    proxiedMatcher.expect(() => () => {}).to.be.function;
    proxiedMatcher.expect(NaN).to.be.NaN;
    proxiedMatcher.expect(randomInteger()).to.be.number;
    proxiedMatcher.expect(null).to.be.null;
    proxiedMatcher.expect({}).to.be.object;
    proxiedMatcher.expect(new Set()).to.be.set;
    proxiedMatcher.expect(randomString()).to.be.string;
    proxiedMatcher.expect(Symbol.for(randomString())).to.be.symbol;
    proxiedMatcher.expect(true).to.be.true;
    proxiedMatcher.expect(undefined).to.be.undefined;
  });

  it('should provide: expect(actual).to.include(expected)', async () => {
    proxiedMatcher.expect([num]).to.include(num);
    proxiedMatcher.expect({ [str]: num }).to.include(str);
    proxiedMatcher.expect(`test${str}`).to.include(str);
    proxiedMatcher.expect([num]).to.not.include(randomInteger() as number);
    proxiedMatcher.expect({ [str]: num }).to.not.include(randomString());
    proxiedMatcher.expect(`test${str}`).to.not.include(randomString());
  });

  it('should provide: expect(actual).to.be.instanceOf(expected)', async () => {
    proxiedMatcher.expect([]).to.be.instanceOf(Array);
    proxiedMatcher.expect({}).to.be.instanceOf(Object);
    proxiedMatcher.expect({}).to.not.be.instanceOf(Array);
  });

  it('should provide: expect(actual).to.be.typeOf(expected)', async () => {
    proxiedMatcher.expect([]).to.not.be.typeOf('array');
    proxiedMatcher.expect([]).to.be.typeOf('object');
    proxiedMatcher.expect([]).to.be.typeOf('object');
    proxiedMatcher.expect(BigInt(randomInteger())).to.be.typeOf('bigint');
    proxiedMatcher.expect(null).to.be.typeOf('object');
    proxiedMatcher.expect(true).to.be.typeOf('boolean');
    proxiedMatcher.expect(randomInteger() as number).to.be.typeOf('number');
    proxiedMatcher.expect(randomString()).to.be.typeOf('string');
    proxiedMatcher.expect(Symbol.for(randomString())).to.be.typeOf('symbol');
    proxiedMatcher.expect(() => () => {}).to.be.typeOf('function');
    proxiedMatcher.expect(undefined).to.be.typeOf('undefined');
  });

  it('should provide: expect(actual).to[.not].thow(*)', async () => {
    const errorText = randomString();
    proxiedMatcher.expect(() => () => {}).to.not.throw();
    proxiedMatcher.expect(() => () => { throw new Error(errorText) }).to.throw();
    proxiedMatcher.expect(() => () => { throw new ReferenceError(errorText) }).to.throw(ReferenceError);
    proxiedMatcher.expect(() => () => { throw new Error(errorText) }).to.not.throw(ReferenceError);
  });
});
