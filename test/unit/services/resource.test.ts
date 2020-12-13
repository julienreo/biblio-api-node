import Product from '@models/product';
import ProductSupplier from '@models/product-supplier';
import Resource from '@models/resource';
import Supplier from '@models/supplier';
import User from '@models/user';
import { _Cache } from '@modules/cache';
import { ApiError, InsertionError, NotFoundError } from '@modules/error';
import resourceService from '@services/resource';
import { expect } from 'chai';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('retrieveAll', () => {
  describe('products', () => {
    const products = [
      {
        id: 1,
        name: 'insert fileté',
        notes: 'notes',
        fkCompany: 1,
        creationDate: '2019-11-24T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'insert fileté 2',
        notes: 'notes',
        fkCompany: 1,
        creationDate: '2019-11-24T00:00:00.000Z',
      },
    ];
    beforeEach(() => {
      sandbox
        .stub(Product, 'findAll')
        .callsFake(() => Promise.resolve(products));
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should return all products', async () => {
      const result = await resourceService.retrieveAll('product', {});
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(products);
    });
  });

  describe('suppliers', () => {
    const suppliers = [
      {
        id: 1,
        name: 'rs-online',
        website: 'https://fr.rs-online.com',
        notes: 'notes',
        fkCompany: 1,
        creationDate: '2019-11-24T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'rs-online-2',
        website: 'https://fr.rs-online-2.com',
        notes: 'notes',
        fkCompany: 1,
        creationDate: '2019-11-24T00:00:00.000Z',
      },
    ];

    beforeEach(() => {
      sandbox
        .stub(Supplier, 'findAll')
        .callsFake(() => Promise.resolve(suppliers));
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should return all suppliers', async () => {
      const result = await resourceService.retrieveAll('supplier', {});
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(suppliers);
    });
  });
});

describe('retrieveOne', () => {
  describe('user', () => {
    const user = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: '$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.',
      creationDate: '2019-11-22T20:14:20.000Z',
    };

    beforeEach(() => {
      sandbox.stub(User, 'findOne').callsFake(() => Promise.resolve(user));
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should return a User resource', async () => {
      const result = await resourceService.retrieveOne(
        'user',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(user);
    });
  });

  describe('product', () => {
    const product = {
      id: 1,
      name: 'insert fileté',
      notes: 'notes',
      fkCompany: 1,
      creationDate: '2019-11-22T20:14:20.000Z',
    };

    beforeEach(() => {
      sandbox
        .stub(Product, 'findOne')
        .callsFake(() => Promise.resolve(product));
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should return a Product resource', async () => {
      const result = await resourceService.retrieveOne(
        'product',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(product);
    });
  });

  describe('supplier', () => {
    const supplier = {
      id: 1,
      name: 'rs-online',
      website: 'https://fr.rs-online.com',
      notes: 'notes',
      fkCompany: 1,
      creationDate: '2019-11-22T20:14:20.000Z',
    };

    beforeEach(() => {
      sandbox
        .stub(Supplier, 'findOne')
        .callsFake(() => Promise.resolve(supplier));
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should return a Supplier resource', async () => {
      const result = await resourceService.retrieveOne(
        'supplier',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(supplier);
    });
  });

  describe('invalid resource name', () => {
    it('should throw an error if the resource name is not valid', async () => {
      try {
        await resourceService.retrieveOne(
          'invalidResourceName',
          {},
          'error message'
        );
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });

  describe('resource not found', () => {
    beforeEach(() => {
      sandbox.stub(User, 'findOne').callsFake(() => undefined);
      sandbox.stub(_Cache.prototype, 'find').callsFake(() => null);
      sandbox.stub(_Cache.prototype, 'save');
    });
    afterEach(() => sandbox.restore());

    it('should throw an error if the resource was not found', async () => {
      try {
        await resourceService.retrieveOne('user', {}, 'error message');
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });
  });
});

describe('insertOne', () => {
  describe('user', () => {
    beforeEach(() =>
      sandbox
        .stub(Resource.prototype, 'save')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 1 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return the ID of the inserted user', async () => {
      const result = await resourceService.insertOne(
        'user',
        {} as any,
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe('product', () => {
    beforeEach(() =>
      sandbox
        .stub(Resource.prototype, 'save')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 1 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return the ID of the inserted product', async () => {
      const result = await resourceService.insertOne(
        'product',
        {} as any,
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe('supplier', () => {
    beforeEach(() =>
      sandbox
        .stub(Resource.prototype, 'save')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 1 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return the ID of the inserted supplier', async () => {
      const result = await resourceService.insertOne(
        'supplier',
        {} as any,
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe('productSupplier', () => {
    beforeEach(() =>
      sandbox
        .stub(Resource.prototype, 'save')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 0 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should not return any ID for the creation of an association between a product and supplier', async () => {
      const result = await resourceService.insertOne(
        'productSupplier',
        {} as any,
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result).to.equal(0);
    });
  });

  describe('resource already exists', () => {
    const error = new Error() as any;
    error.errno = 1062;

    beforeEach(() => sandbox.stub(Resource.prototype, 'save').throws(error));
    afterEach(() => sandbox.restore());

    it('should throw an error if the resource already exists', async () => {
      try {
        await resourceService.insertOne('user', {} as any, 'error message');
      } catch (e) {
        expect(e).to.be.instanceof(InsertionError);
        expect(e.message).to.equal('error message');
      }
    });
  });

  describe('handle error', () => {
    beforeEach(() =>
      sandbox.stub(Resource.prototype, 'save').throws(new Error())
    );
    afterEach(() => sandbox.restore());

    it('should throw again the error that has been catched', async () => {
      try {
        await resourceService.insertOne('user', {} as any, 'error message');
      } catch (e) {
        expect(e).to.be.instanceof(Error);
      }
    });
  });

  describe('invalid resource name', () => {
    it('should throw an error if the resource name is not valid', async () => {
      try {
        await resourceService.insertOne(
          'invalidResourceName',
          {} as any,
          'error message'
        );
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });
});

describe('updateOne', () => {
  describe('product', () => {
    beforeEach(() =>
      sandbox
        .stub(Product, 'modifyOne')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 0 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.updateOne(
        'product',
        {},
        {},
        { notFound: 'not found', alreadyExists: 'already exists' }
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('supplier', () => {
    beforeEach(() =>
      sandbox
        .stub(Supplier, 'modifyOne')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 0 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.updateOne(
        'supplier',
        {},
        {},
        { notFound: 'not found', alreadyExists: 'already exists' }
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('productSupplier', () => {
    beforeEach(() =>
      sandbox
        .stub(ProductSupplier, 'modifyOne')
        .callsFake(
          () => Promise.resolve({ affectedRows: 1, insertId: 0 }) as any
        )
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.updateOne(
        'productSupplier',
        {},
        {},
        { notFound: 'not found', alreadyExists: 'already exists' }
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('resource does not not exist', () => {
    beforeEach(() =>
      sandbox
        .stub(Product, 'modifyOne')
        .callsFake(() => Promise.resolve({ affectedRows: 0 }) as any)
    );
    afterEach(() => sandbox.restore());

    it('should throw an error if the resource does not exist', async () => {
      try {
        await resourceService.updateOne(
          'product',
          {},
          {},
          { notFound: 'not found', alreadyExists: 'already exists' }
        );
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });

    it('should not throw an error if the resource does not exist and the error message is null', async () => {
      const result = await resourceService.updateOne('product', {}, {}, null);
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(0);
    });

    it('should throw an error if the resource does not exist and the error message is not null', async () => {
      try {
        await resourceService.updateOne(
          'product',
          {},
          {},
          { notFound: 'not found', alreadyExists: 'already exists' }
        );
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });
  });

  describe('fields to update already exists and must be unique', () => {
    beforeEach(() =>
      sandbox.stub(Product, 'modifyOne').throws({ errno: 1062 })
    );
    afterEach(() => sandbox.restore());

    it('should throw an error if the values of the fields to update already exists and must be unique', async () => {
      try {
        await resourceService.updateOne(
          'product',
          {},
          {},
          { notFound: 'not found', alreadyExists: 'already exists' }
        );
      } catch (e) {
        expect(e).to.be.instanceof(InsertionError);
      }
    });
  });

  describe('invalid resource name', () => {
    it('should throw an error if the resource name is not valid', async () => {
      try {
        await resourceService.updateOne('invalidName', {}, {}, {} as any);
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });
});

describe('removeOne', () => {
  describe('product', () => {
    beforeEach(() =>
      sandbox
        .stub(Product, 'deleteOne')
        .callsFake(() => Promise.resolve({ affectedRows: 1 }) as any)
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.removeOne(
        'product',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('supplier', () => {
    beforeEach(() =>
      sandbox
        .stub(Supplier, 'deleteOne')
        .callsFake(() => Promise.resolve({ affectedRows: 1 }) as any)
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.removeOne(
        'supplier',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('productSupplier', () => {
    beforeEach(() =>
      sandbox
        .stub(ProductSupplier, 'deleteOne')
        .callsFake(() => Promise.resolve({ affectedRows: 1 }) as any)
    );
    afterEach(() => sandbox.restore());

    it('should return that one row has been affected', async () => {
      const result = await resourceService.removeOne(
        'productSupplier',
        {},
        'error message'
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe('invalid resource name', () => {
    it('should throw an error if the resource name is not valid', async () => {
      try {
        await resourceService.removeOne(
          'invalidResourceName',
          {},
          'error message'
        );
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });

  describe('resource does not not exist', () => {
    beforeEach(() =>
      sandbox
        .stub(Product, 'deleteOne')
        .callsFake(() => Promise.resolve({ affectedRows: 0 }) as any)
    );
    afterEach(() => sandbox.restore());

    it('should throw an error if the resource does not exist', async () => {
      try {
        await resourceService.removeOne('product', {}, 'error message');
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });

    it('should not throw an error if the resource does not exist but error message is null', async () => {
      const result = await resourceService.removeOne('product', {}, null);
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(0);
    });
  });
});
