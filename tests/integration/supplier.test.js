/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const {expect} = chai;

const app = require(`${appRoot}/index`);
const {getAccessToken} = require(`${appRoot}/tests/utils`);
const {db} = require(`${appRoot}/src/modules/database`);

describe("supplier", () => {
  let accessToken;

  before(async () => {
    // Restore tables to their default values before running the tests
    await db.query("CALL reset_tables();", {});
    accessToken = await getAccessToken();
  });

  describe("GET /suppliers/id", () => {
    it("should return the supplier that matches the provided ID", (done) => {
      chai
        .request(app)
        .get("/suppliers/1")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            supplier: {
              id: 1,
              name: "rs-online",
              website: "https://fr.rs-online.com",
              notes: "notes",
              fkUser: 1,
              creationDate: "2019-11-23T23:00:00.000Z"
            }
          });
          done();
        });
    });

    it("should return an error object if no supplier is matching the provided ID", (done) => {
      chai
        .request(app)
        .get("/suppliers/4")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le fournisseur n'existe pas"
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
        .get("/suppliers/4")
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

  describe("POST /suppliers", () => {
    const supplier = {name: "rs-online-3", website: "http://supplier.com", notes: "notes"};

    it("should create a supplier and return a success message", (done) => {
      chai
        .request(app)
        .post("/suppliers")
        .set({
          "access-token": accessToken,
          "Content-Type": "application/json"
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le fournisseur a été créé avec succès"
          });
          done();
        });
    });
  });

  describe("PUT /suppliers/id", () => {
    const supplier = {name: "rs-online-bis", website: "http://supplier-bis.com"};

    it("should update a supplier and return a success message", (done) => {
      chai
        .request(app)
        .put("/suppliers/1")
        .set({
          "access-token": accessToken,
          "Content-Type": "application/json"
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le fournisseur a été mis à jour avec succès"
          });
          done();
        });
    });

    it("should return an error object if no supplier is matching the provided ID", (done) => {
      chai
        .request(app)
        .put("/suppliers/5")
        .set("access-token", accessToken)
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le fournisseur n'existe pas"
            }
          });
          done();
        });
    });
  });

  describe("DELETE /suppliers/id", () => {
    it("should delete the supplier that matches the provided ID and return a success message", (done) => {
      chai
        .request(app)
        .delete("/suppliers/2")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: "Le fournisseur a été supprimé avec succès"
          });
          done();
        });
    });

    it("should return an error object if no supplier is matching the provided ID", (done) => {
      chai
        .request(app)
        .delete("/suppliers/5")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            error: {
              name: "NotFoundError",
              message: "Le fournisseur n'existe pas"
            }
          });
          done();
        });
    });

    it("should return an error object if products are associated with the supplier to remove", (done) => {
      chai
        .request(app)
        .delete("/suppliers/1")
        .set("access-token", accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: {
              name: "RemovalError",
              message: "Des produits sont associés à ce fournisseur"
            }
          });
          done();
        });
    });
  });
});