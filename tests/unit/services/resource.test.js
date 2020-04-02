/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const {expect} = require("chai");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();

const resourceService = require(`${appRoot}/src/services/resource`);
const User = require(`${appRoot}/src/models/user`);
const Product = require(`${appRoot}/src/models/product`);
const Supplier = require(`${appRoot}/src/models/supplier`);
const ProductSupplier = require(`${appRoot}/src/models/product-supplier`);
const Resource = require(`${appRoot}/src/models/resource`);
const ApiError = require(`${appRoot}/src/modules/errors/api`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError} = require(`${appRoot}/src/modules/errors/database`);
const {_Cache} = require(`${appRoot}/src/modules/cache`);

describe("retrieveAll", () => {
  describe("products", () => {
    const products = [
      {
        id: 1,
        name: "insert fileté",
        notes: "notes",
        fkCompany: 1,
        creationDate: "2019-11-24T00:00:00.000Z"
      },
      {
        id: 2,
        name: "insert fileté 2",
        notes: "notes",
        fkCompany: 1,
        creationDate: "2019-11-24T00:00:00.000Z"
      }
    ];
    beforeEach(() => {
      sandbox.stub(Product, "findAll").returns(products);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should return all products", async () => {
      const result = await resourceService.retrieveAll("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(products);
    });
  });

  describe("suppliers", () => {
    const suppliers = [
      {
        id: 1,
        name: "rs-online",
        website: "https://fr.rs-online.com",
        notes: "notes",
        fkCompany: 1,
        creationDate: "2019-11-24T00:00:00.000Z"
      },
      {
        id: 2,
        name: "rs-online-2",
        website: "https://fr.rs-online-2.com",
        notes: "notes",
        fkCompany: 1,
        creationDate: "2019-11-24T00:00:00.000Z"
      }
    ];

    beforeEach(() => {
      sandbox.stub(Supplier, "findAll").returns(suppliers);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should return all suppliers", async () => {
      const result = await resourceService.retrieveAll("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(suppliers);
    });
  });
});

describe("retrieveOne", () => {
  describe("user", () => {
    const user = {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@gmail.com",
      password: "$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.",
      creationDate: "2019-11-22T20:14:20.000Z"
    };

    beforeEach(() => {
      sandbox.stub(User, "findOne").returns(user);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should return a User resource", async () => {
      const result = await resourceService.retrieveOne("user", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(user);
    });
  });

  describe("product", () => {
    const product = {
      id: 1,
      name: "insert fileté",
      notes: "notes",
      fkCompany: 1,
      creationDate: "2019-11-22T20:14:20.000Z"
    };

    beforeEach(() => {
      sandbox.stub(Product, "findOne").returns(product);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should return a Product resource", async () => {
      const result = await resourceService.retrieveOne("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(product);
    });
  });

  describe("supplier", () => {
    const supplier = {
      id: 1,
      name: "rs-online",
      website: "https://fr.rs-online.com",
      notes: "notes",
      fkCompany: 1,
      creationDate: "2019-11-22T20:14:20.000Z"
    };

    beforeEach(() => {
      sandbox.stub(Supplier, "findOne").returns(supplier);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should return a Supplier resource", async () => {
      const result = await resourceService.retrieveOne("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(supplier);
    });
  });

  describe("invalid resource name", () => {
    it("should throw an error if the resource name is not valid", async () => {
      try {
        await resourceService.retrieveOne("invalidResourceName", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });

  describe("resource not found", () => {
    beforeEach(() => {
      // eslint-disable-next-line no-undefined
      sandbox.stub(User, "findOne").returns(undefined);
      sandbox.stub(_Cache.prototype, "find").returns(null);
      sandbox.stub(_Cache.prototype, "save");
    });
    afterEach(() => sandbox.restore());

    it("should throw an error if the resource was not found", async () => {
      try {
        await resourceService.retrieveOne("user", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });
  });
});

describe("insertOne", () => {
  describe("user", () => {
    beforeEach(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    afterEach(() => sandbox.restore());

    it("should return the ID of the inserted user", async () => {
      const result = await resourceService.insertOne("user", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("product", () => {
    beforeEach(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    afterEach(() => sandbox.restore());

    it("should return the ID of the inserted product", async () => {
      const result = await resourceService.insertOne("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("supplier", () => {
    beforeEach(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    afterEach(() => sandbox.restore());

    it("should return the ID of the inserted supplier", async () => {
      const result = await resourceService.insertOne("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("productSupplier", () => {
    beforeEach(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 0}));
    afterEach(() => sandbox.restore());

    it("should not return any ID for the creation of an association between a product and supplier", async () => {
      const result = await resourceService.insertOne("productSupplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(0);
    });
  });

  describe("resource already exists", () => {
    const error = new Error();
    error.errno = 1062;

    beforeEach(() => sandbox.stub(Resource.prototype, "save").throws(error));
    afterEach(() => sandbox.restore());

    it("should throw an error if the resource already exists", async () => {
      try {
        await resourceService.insertOne("user", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(InsertionError);
        expect(e.message).to.equal("error message");
      }
    });
  });

  describe("handle error", () => {
    beforeEach(() => sandbox.stub(Resource.prototype, "save").throws(new Error()));
    afterEach(() => sandbox.restore());

    it("should throw again the error that has been catched", async () => {
      try {
        await resourceService.insertOne("user", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(Error);
      }
    });
  });

  describe("invalid resource name", () => {
    it("should throw an error if the resource name is not valid", async () => {
      try {
        await resourceService.insertOne("invalidResourceName", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });
});

describe("updateOne", () => {
  describe("product", () => {
    beforeEach(() => sandbox.stub(Product, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.updateOne(
        "product",
        {},
        {},
        {notFound: "not found", alreadyExists: "already exists"}
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("supplier", () => {
    beforeEach(() => sandbox.stub(Supplier, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.updateOne(
        "supplier",
        {},
        {},
        {notFound: "not found", alreadyExists: "already exists"}
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("productSupplier", () => {
    beforeEach(() => sandbox.stub(ProductSupplier, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.updateOne(
        "productSupplier",
        {},
        {},
        {notFound: "not found", alreadyExists: "already exists"}
      );
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("resource does not not exist", () => {
    beforeEach(() => sandbox.stub(Product, "modifyOne").returns({affectedRows: 0}));
    afterEach(() => sandbox.restore());

    it("should throw an error if the resource does not exist", async () => {
      try {
        await resourceService.updateOne(
          "product",
          {},
          {},
          {notFound: "not found", alreadyExists: "already exists"}
        );
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });

    it("should not throw an error if the resource does not exist and the error message is null", async () => {
      const result = await resourceService.updateOne("product", {}, {}, null);
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(0);
    });

    it("should throw an error if the resource does not exist and the error message is not null", async () => {
      try {
        await resourceService.updateOne(
          "product",
          {},
          {},
          {notFound: "not found", alreadyExists: "already exists"}
        );
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });
  });

  describe("fields to update already exists and must be unique", () => {
    beforeEach(() => sandbox.stub(Product, "modifyOne").throws({errno: 1062}));
    afterEach(() => sandbox.restore());

    it("should throw an error if the values of the fields to update already exists and must be unique", async () => {
      try {
        await resourceService.updateOne(
          "product",
          {},
          {},
          {notFound: "not found", alreadyExists: "already exists"}
        );
      } catch (e) {
        expect(e).to.be.instanceof(InsertionError);
      }
    });
  });

  describe("invalid resource name", () => {
    it("should throw an error if the resource name is not valid", async () => {
      try {
        await resourceService.updateOne("invalidName", {}, {});
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });
});

describe("removeOne", () => {
  describe("product", () => {
    beforeEach(() => sandbox.stub(Product, "deleteOne").returns({affectedRows: 1}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.removeOne("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("supplier", () => {
    beforeEach(() => sandbox.stub(Supplier, "deleteOne").returns({affectedRows: 1}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.removeOne("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("productSupplier", () => {
    beforeEach(() => sandbox.stub(ProductSupplier, "deleteOne").returns({affectedRows: 1}));
    afterEach(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.removeOne("productSupplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("invalid resource name", () => {
    it("should throw an error if the resource name is not valid", async () => {
      try {
        await resourceService.removeOne("invalidResourceName", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(ApiError);
      }
    });
  });

  describe("resource does not not exist", () => {
    beforeEach(() => sandbox.stub(Product, "deleteOne").returns({affectedRows: 0}));
    afterEach(() => sandbox.restore());

    it("should throw an error if the resource does not exist", async () => {
      try {
        await resourceService.removeOne("product", {}, "error message");
      } catch (e) {
        expect(e).to.be.instanceof(NotFoundError);
      }
    });

    it("should not throw an error if the resource does not exist but error message is null", async () => {
      const result = await resourceService.removeOne("product", {}, null);
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(0);
    });
  });
});