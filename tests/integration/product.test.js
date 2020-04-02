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

describe("products", () => {
  let accessToken;

  before(async () => {
    // Flush cache
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query("CALL reset_tables();", {});
    accessToken = await getAccessToken();
  });

  describe("GET /products/id", () => {
    it("should return the product that matches the provided ID", (done) => {
      chai
        .request(app)
        .get("/products/1")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            product: {
              id: 1,
              name: "insert fileté",
              notes: "notes",
              fkCompany: 1,
              creationDate: "2019-11-24T00:00:00.000Z"
            }
          });
          done();
        });
    });

    it("should return an error object if no product is matching the provided ID", (done) => {
      chai
        .request(app)
        .get("/products/4")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le produit n'existe pas"
            }
          });
          done();
        });
    });

    it("should return an error if the provided access token is not valid", (done) => {
      // eslint-disable-next-line no-unused-vars
      const expiredAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NTAzMDg4LCJleHAiOjE1Njg1NDYyODh9.Yhauj9gIvkr-6awmo2Z0sKIRfWqt03iXBk-bYUia7oE";

      chai
        .request(app)
        .get("/products/4")
        .set("access-token", expiredAccessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.deep.equal({
            error: "Token invalide"
          });
          done();
        });
    });
  });

  describe("POST /products", () => {
    const product = {name: "insert fileté 3", notes: "notes"};

    it("should create a product and return a success message", (done) => {
      chai
        .request(app)
        .post("/products")
        .set({
          "access-token": accessToken,
          "Content-Type": "application/json"
        })
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le produit a été créé avec succès"
          });
          done();
        });
    });
  });

  describe("PUT /products/id", () => {
    const product = {name: "insert fileté bis"};

    it("should update a product and return a success message", (done) => {
      chai
        .request(app)
        .put("/products/1")
        .set({
          "access-token": accessToken,
          "Content-Type": "application/json"
        })
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le produit a été mis à jour avec succès"
          });
          done();
        });
    });

    it("should return an error object if no product is matching the provided ID", (done) => {
      chai
        .request(app)
        .put("/products/5")
        .set("access-token", accessToken)
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le produit n'existe pas"
            }
          });
          done();
        });
    });
  });

  describe("DELETE /products/id", () => {
    it("should delete the product that matches the provided ID and return a success message", (done) => {
      chai
        .request(app)
        .delete("/products/2")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le produit a été supprimé avec succès"
          });
          done();
        });
    });

    it("should return an error object if no product is matching the provided ID", (done) => {
      chai
        .request(app)
        .delete("/products/5")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le produit n'existe pas"
            }
          });
          done();
        });
    });
  });
});