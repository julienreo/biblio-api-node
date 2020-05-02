/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const {expect} = chai;

const app = require(`${appRoot}/index`);
const {getAccessToken} = require(`${appRoot}/tests/utils`);
const {databaseClient} = require(`${appRoot}/src/modules/database`);
const {cacheClient} = require(`${appRoot}/src/modules/cache`);

describe("productSupplier", () => {
  let accessToken;

  before(async () => {
    // Flush cache
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query("CALL reset_tables();", {});
    accessToken = await getAccessToken();
  });

  describe("POST /productSuppliers", () => {
    it("should create an associtation between a product and a supplier and return a success message", (done) => {
      const productSupplier = {fkProduct: 2, fkSupplier: 2, notes: "notes"};

      chai
        .request(app)
        .post("/productsSuppliers")
        .set({
          "access-token": accessToken,
          "Content-Type": "application/json"
        })
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "L'association entre le produit et le fournisseur a été créée avec succès"
          });
          done();
        });
    });

    it("should return an error if the product or the supplier does not exist", (done) => {
      const productSupplier = {fkProduct: 5, fkSupplier: 2, notes: "notes"};

      chai
        .request(app)
        .post("/productsSuppliers")
        .set("access-token", accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: [
              "Le produit ou le fournisseur n'existe pas"
            ]
          });
          done();
        });
    });

    it("should return an error if the product doesn't exist", (done) => {
      const productSupplier = {fkProduct: 55, fkSupplier: 1, notes: "notes"};

      chai
        .request(app)
        .post("/productsSuppliers")
        .set("access-token", accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: [
              "Le produit ou le fournisseur n'existe pas"
            ]
          });
          done();
        });
    });

    it("should return an error if the supplier doesn't exist", (done) => {
      const productSupplier = {fkProduct: 5, fkSupplier: 11, notes: "notes"};

      chai
        .request(app)
        .post("/productsSuppliers")
        .set("access-token", accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: [
              "Le produit ou le fournisseur n'existe pas"
            ]
          });
          done();
        });
    });

    it("should return an error if the provided access token is not valid", (done) => {
      // eslint-disable-next-line no-unused-vars
      const expiredAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NTAzMDg4LCJleHAiOjE1Njg1NDYyODh9.Yhauj9gIvkr-6awmo2Z0sKIRfWqt03iXBk-bYUia7oE";

      chai
        .request(app)
        .post("/productsSuppliers")
        .set("access-token", expiredAccessToken)
        .send({})
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.deep.equal({
            errors: [
              "Token invalide"
            ]
          });
          done();
        });
    });
  });

  describe("DELETE /productSuppliers", () => {
    it("should delete an associtation between a product and a supplier and return a success message", (done) => {
      const productSupplier = {fkProduct: 2, fkSupplier: 1};

      chai
        .request(app)
        .delete("/productsSuppliers")
        .set("access-token", accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "L'association entre le produit et le fournisseur a été supprimée avec succès"
          });
          done();
        });
    });

    it("should return an error if no associtation exists between a product and a supplier", (done) => {
      const unexistingProductSupplier = {fkProduct: 3, fkSupplier: 1};

      chai
        .request(app)
        .delete("/productsSuppliers")
        .set("access-token", accessToken)
        .send(unexistingProductSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: [
              "L'association entre le produit et le fournisseur n'existe pas"
            ]
          });
          done();
        });
    });
  });
});