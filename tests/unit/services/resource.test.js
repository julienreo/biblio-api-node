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

    before(() => sandbox.stub(User, "findOne").returns(user));
    after(() => sandbox.restore());

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
      fkUser: 1,
      creationDate: "2019-11-22T20:14:20.000Z"
    };

    before(() => sandbox.stub(Product, "findOne").returns(product));
    after(() => sandbox.restore());

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
      fkUser: 1,
      creationDate: "2019-11-22T20:14:20.000Z"
    };

    before(() => sandbox.stub(Supplier, "findOne").returns(supplier));
    after(() => sandbox.restore());

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
    // eslint-disable-next-line no-undefined
    before(() => sandbox.stub(User, "findOne").returns(undefined));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    after(() => sandbox.restore());

    it("should return the ID of the inserted user", async () => {
      const result = await resourceService.insertOne("user", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("product", () => {
    before(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    after(() => sandbox.restore());

    it("should return the ID of the inserted product", async () => {
      const result = await resourceService.insertOne("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("supplier", () => {
    before(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 1}));
    after(() => sandbox.restore());

    it("should return the ID of the inserted supplier", async () => {
      const result = await resourceService.insertOne("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(1);
    });
  });

  describe("productSupplier", () => {
    before(() => sandbox.stub(Resource.prototype, "save").returns({affectedRows: 1, insertId: 0}));
    after(() => sandbox.restore());

    it("should not return any ID for the creation of an association between a product and supplier", async () => {
      const result = await resourceService.insertOne("productSupplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result).to.equal(0);
    });
  });

  describe("resource already exists", () => {
    const error = new Error();
    error.errno = 1062;

    before(() => sandbox.stub(Resource.prototype, "save").throws(error));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Resource.prototype, "save").throws(new Error()));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Product, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Supplier, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(ProductSupplier, "modifyOne").returns({affectedRows: 1, insertId: 0}));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Product, "modifyOne").returns({affectedRows: 0}));
    after(() => sandbox.restore());

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

  describe("fields to update already exist and must be unique", () => {
    before(() => sandbox.stub(Product, "modifyOne").throws({errno: 1062}));
    after(() => sandbox.restore());

    it("should throw an error if the values of the fields to update already exist and must be unique", async () => {
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
    before(() => sandbox.stub(Product, "deleteOne").returns({affectedRows: 1}));
    after(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.removeOne("product", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("supplier", () => {
    before(() => sandbox.stub(Supplier, "deleteOne").returns({affectedRows: 1}));
    after(() => sandbox.restore());

    it("should return that one row has been affected", async () => {
      const result = await resourceService.removeOne("supplier", {}, "error message");
      expect(result).to.not.be.undefined;
      expect(result.affectedRows).to.equal(1);
    });
  });

  describe("productSupplier", () => {
    before(() => sandbox.stub(ProductSupplier, "deleteOne").returns({affectedRows: 1}));
    after(() => sandbox.restore());

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
    before(() => sandbox.stub(Product, "deleteOne").returns({affectedRows: 0}));
    after(() => sandbox.restore());

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