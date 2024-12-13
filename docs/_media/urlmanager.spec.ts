import {
  expect as chaiExpect,
} from 'chai';
import {
  clamp,
  randomInteger,
  randomString,
} from '../utils';
import {
  URLManager,
} from './urlmanager';

/**
 * Mocking these for testing
 */
globalThis.URL.createObjectURL = jest.fn(() => `https://${randomString()}` );
globalThis.URL.revokeObjectURL = jest.fn(() => {});

describe('URLManager', () => {
  const testUrl = 'http://localhost/';
  
  it('should instantiate', async () => {
    chaiExpect(new URLManager(testUrl)).to.not.be.null;
  });

  describe('static', () => {
    /**
     * - Test that url is captured in objectURLs when createObjectURL is called.
     */
    it('should create an ObjectURL with a stored url', async () => {
      chaiExpect(URLManager.objectURLS.length).to.eq(0);
      const num = clamp(<number>randomInteger(1), 1, 9);
      const urls: string[] = [];
      new Array(num).fill(null).forEach(() => {
        const text = randomString();
        const urlObject = new Blob([text], { type: 'text/plain'});
        const url = URLManager.createObjectURL(urlObject);
        urls.push(url);
      });
      chaiExpect(URLManager.objectURLS).to.include.members(urls);
    });
    
    /**
     * - Test that currentUrl is a URLManager instance of the current this.location.href
     */
    it('should return an instance of the current url', async () => {
      const instance = URLManager.currentUrl;
      chaiExpect(instance).to.be.instanceof(URLManager);
      chaiExpect(instance.href).to.eq(testUrl);
    });

    /**
     * - Test that revokeObjectURL
     */
    it('shoould remove url reference when revoking a url', async () => {
      const text = randomString();
      const urlObject = new Blob([text], { type: 'text/plain'});
      const revokableUrl = URLManager.createObjectURL(urlObject);
      chaiExpect(URLManager.objectURLS.includes(revokableUrl)).to.be.true;
      URLManager.revokeObjectURL(revokableUrl);
      chaiExpect(URLManager.objectURLS.includes(revokableUrl)).to.not.be.true;
    });

    /**
     * - Test that revokeObjectURLs removes all objectURLS entries
     */
    it('should revoke all objectURLs', async () => {
      const text = randomString();
      const urlObject = new Blob([text], { type: 'text/plain'});
      URLManager.createObjectURL(urlObject);
      URLManager.revokeAllObjectURLs();
      chaiExpect(URLManager.objectURLS.length).to.eq(0);
    });
  });

  describe('params', () => {
    it('should return an object for url params', async () => {
      const key = randomString();
      const val = randomString();
      const url = `${testUrl}/path?${key}=${val}`;
      const instance = new URLManager(url);
      chaiExpect(instance.params[key]).to.eq(val);
    });

    it('should accept an object for setting url params', async () => {
      const key = randomString();
      const val = randomString();
      const obj = {
        [key]: val,
      };
      const url = `${testUrl}/path`;
      const instance = new URLManager(url);
      chaiExpect(instance.href.includes(`${key}=${val}`)).to.be.false;
      instance.params = obj;
      chaiExpect(instance.href.includes(`${key}=${val}`)).to.be.true;
    });
  });
});