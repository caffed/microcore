import {
  expect as chaiExpect,
} from 'chai';
import {
  randomString,
} from '../utils';
import {
  identity,
  noop,
} from './combinators';

describe('combinators', () => {
  describe('noop/N', () => {
    it('should accept any parameter signature and return nothing', async () => {
      chaiExpect(noop()).to.be.undefined;
      chaiExpect(noop(randomString())).to.be.undefined;
    });
  });

  describe('identity/I', () => {
    it('should have the same parameter and return values', async () => {
      const str = randomString();
      chaiExpect(identity(str)).to.eq(str);
      chaiExpect(identity(str)).to.not.eq(randomString());
    });
  });
});