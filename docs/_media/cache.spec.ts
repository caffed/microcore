import {
  expect as chaiExpect,
} from 'chai';
import {
  clamp,
  randomInteger,
  randomString,
} from '../utils';
import {
  type Cache,
  createMapCache,
  MapCache,
} from './cache';

function runTests(factory: any) {
  let cache: Cache<string, any>;

  beforeEach(() => {
    cache = new factory();
  });

  it('should instantiate', async () => {
    chaiExpect(cache).to.be.not.null;
  });

  it('should clear all entries', async () => {
    const keyOne = randomString();
    const valOne = randomString();
    const keyTwo = randomString();
    const valTwo = randomString();
    cache.setValue(keyOne, valOne);
    cache.setValue(keyTwo, valTwo);
    cache.clear();
    chaiExpect(cache.getValue(keyOne)).to.eq(undefined);
    chaiExpect(cache.getValue(keyTwo)).to.eq(undefined);
  });

  it('should get the value by key', async () => {
    const key = randomString();
    const val = randomString();
    cache.setValue(key, val);
    chaiExpect(cache.getValue(key)).to.eq(val);
  });

  it('should return true for present value', async () => {
    const key = randomString();
    const val = randomString();
    cache.setValue(key, val);
    chaiExpect(cache.hasValue(key)).to.be.true;
    chaiExpect(cache.hasValue(randomString())).to.be.false;
  });

  it('should return the key length', async () => {
    const times = clamp(<number>randomInteger(), 1, 9);
    new Array(times).fill(0).forEach(_ => {
      const keyOne = randomString();
      const valOne = randomString();
      cache.setValue(keyOne, valOne);
    }); 
    chaiExpect(cache.length).to.eq(times);
  });
  
  it('should have a name',  async () => {
    chaiExpect(cache.name).to.not.be.null;
  });

  it('should have specified a name',  async () => {
    const name = randomString();
    cache = new factory({ name });
    chaiExpect(cache.name).to.eq(name);
  });

  it('should set the cache value for key', async () => {
    chaiExpect(cache.length).to.eq(0);
    const key = randomString();
    const val = randomString();
    cache.setValue(key, val);
    chaiExpect(cache.length).to.eq(1);
    chaiExpect(cache.getValue(key)).to.eq(val);
  });

  it('should remove a value by key', async () => {
    const key = randomString();
    const val = randomString();
    cache.setValue(key, val);
    const result = cache.removeValue(key);
    chaiExpect(result).to.eq(true);
    chaiExpect(cache.getValue(key)).to.eq(undefined);
  });
}

describe('cache', () => {
  describe('MapCache', () => {
    runTests(MapCache);
  });

  describe('createMapCache', () => {
    runTests(createMapCache);
  });
});