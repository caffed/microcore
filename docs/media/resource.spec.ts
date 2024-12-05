import {
  expect as chaiExpect,
} from 'chai';
import {
  createResource,
  createTextResource,
  ResourceController,
} from './resource';
import { randomString } from '../utils';
import { identity } from '../combinators';

globalThis.URL.createObjectURL = jest.fn(() => `${globalThis.location.href}${randomString()}` );
globalThis.URL.revokeObjectURL = jest.fn(() => {});

describe('Resource', () => {
  describe('ResourceController', () => {
    describe('static', () => {
      it('should validate scoped reference strings', async () => {
        chaiExpect(ResourceController.validateIdString(randomString())).to.be.true;
        chaiExpect(ResourceController.validateIdString(randomString() + '/' + randomString())).to.be.false;
      });
      it('should list created object urls ', async () => {
        chaiExpect(Object.keys(ResourceController.list()).length).to.eq(0);
        const rcName = randomString();
        const resourceName = randomString();
        const rc = new ResourceController(rcName);
        rc.create({
          name: resourceName,
          mimeType: 'text/plain',
          factory: (a: any) => a,
          data: randomString(),
        });
        chaiExpect(Object.keys(ResourceController.list()).length).to.eq(1);
        chaiExpect(typeof ResourceController.list()[rcName][resourceName]).to.eq('object');
      });
    });
    
    describe('instance', () => {
      let data: any, ctrl: string, name: string, rc: any, resource: any;
      const mimeType = 'text/plain';
      const factory = identity;

      beforeEach(() => {
        ctrl = randomString();
        data = randomString();
        name = randomString();
        rc = new ResourceController(ctrl);
        resource = rc.create({
          name,
          data,
          mimeType,
          factory,
        });
      });

      it('should instantiate', async () => {
        chaiExpect(rc).to.not.be.undefined;
      });

      it('should create a resource', async () => {
        chaiExpect(resource).to.not.be.undefined;
      });
      
      it('should delete a resource by name', async () => {
        chaiExpect(rc.delete(name)).to.be.true;
      });
      
      it('should get a resource by name', async () => {
        chaiExpect(rc.get(name)).to.eq(resource);
      });
      
      it('should update a resource by name', async () => {
        const newData = randomString();
        const updated = rc.update({
          data: newData,
          name,
        });

        chaiExpect(updated.data).to.eq(newData);
        chaiExpect(resource.url).to.not.eq(updated.url);
      });
    });
  });

  describe('createResource', () => {
    let data: any, name: string, mimeType: any, rc: any;
    const factory = (a: any) => a;

    beforeEach(() => {
      data = randomString();
      name = randomString();
      mimeType = 'text/plain';
      rc = createResource({
        data,
        factory,
        name,
        mimeType,
      })();
    });

    it('should instantiate', async () => {
      chaiExpect(rc).to.not.be.null;
    });
    
    it('should return the resource blob', async () => {
      chaiExpect(rc.blob.size).to.eq(data.length);
    });

    it('should return the resource data', async () => {
      chaiExpect(rc.data).to.eq(data);
    });

    it('should return the resource factory', async () => {
      chaiExpect(rc.factory).to.eq(factory);
    });

    it('should return the resource mimeType', async () => {
      chaiExpect(rc.mimeType).to.eq(mimeType);
    });

    it('should return the resource name', async () => {
      chaiExpect(rc.name).to.eq(name);
    });

    it('should revoke a url', async () => {
      const url = rc.url;
      rc.revokeUrl();
      chaiExpect(rc.url).to.not.eq(url);
    });

    it('should return a string version of the resource', async () => {
      chaiExpect(rc.toString()).to.eq(data);
    });

    it('should return the resource url', async () => {
      chaiExpect(rc.url).to.a.string;
    });
  });
  
  describe('createTextResource', () => {
    let body: any, name: string, mimeType: any, rc: any;
    const factory = (a: any) => a;

    beforeEach(() => {
      body = randomString();
      name = randomString();
      mimeType = 'text/plain';
      rc = createTextResource({
        factory,
        name,
        mimeType,
      })`${body}`;
    });

    it('should instantiate', async () => {
      chaiExpect(createTextResource).to.not.be.null;
    });
    
    it('should return the resource blob', async () => {
      chaiExpect(rc.blob.size).to.eq(body.length);
    });

    it('should return the resource data', async () => {
      chaiExpect(rc.data).to.eq(body);
    });

    it('should return the resource factory', async () => {
      chaiExpect(rc.factory).to.eq(factory);
    });

    it('should return the resource mimeType', async () => {
      chaiExpect(rc.mimeType).to.eq(mimeType);
    });

    it('should return the resource name', async () => {
      chaiExpect(rc.name).to.eq(name);
    });

    it('should revoke a url', async () => {
      const url = rc.url;
      rc.revokeUrl();
      chaiExpect(rc.url).to.not.eq(url);
    });

    it('should return a string version of the resource', async () => {
      chaiExpect(rc.toString()).to.eq(body);
    });

    it('should return the resource url', async () => {
      chaiExpect(rc.url).to.a.string;
    });
  });
});
