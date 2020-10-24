import cacheClient from '@modules/cache';
import databaseClient from '@modules/database';
import { server } from '@src/index';
import { getAccessToken } from '@test/utils';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

describe('productSupplier', () => {
  let accessToken: any;

  before(async () => {
    // Flush cache
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query('CALL reset_tables();', {});
    accessToken = await getAccessToken();
  });

  describe('POST /productSuppliers', () => {
    it('should create an associtation between a product and a supplier and return a success message', (done) => {
      const productSupplier = { fkProduct: 13, fkSupplier: 3, notes: 'notes' };

      chai
        .request(server)
        .post('/productsSuppliers')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message:
              "L'association entre le produit et le fournisseur a été créée avec succès",
          });
          done();
        });
    });

    it('should return an error if the product or the supplier does not exist', (done) => {
      const productSupplier = { fkProduct: 14, fkSupplier: 3, notes: 'notes' };

      chai
        .request(server)
        .post('/productsSuppliers')
        .set('access-token', accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: ["Le produit ou le fournisseur n'existe pas"],
          });
          done();
        });
    });

    it("should return an error if the product doesn't exist", (done) => {
      const productSupplier = { fkProduct: 14, fkSupplier: 1, notes: 'notes' };

      chai
        .request(server)
        .post('/productsSuppliers')
        .set('access-token', accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: ["Le produit ou le fournisseur n'existe pas"],
          });
          done();
        });
    });

    it("should return an error if the supplier doesn't exist", (done) => {
      const productSupplier = { fkProduct: 13, fkSupplier: 5, notes: 'notes' };

      chai
        .request(server)
        .post('/productsSuppliers')
        .set('access-token', accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: ["Le produit ou le fournisseur n'existe pas"],
          });
          done();
        });
    });

    it('should return an error if the provided access token is not valid', (done) => {
      const expiredAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NTAzMDg4LCJleHAiOjE1Njg1NDYyODh9.Yhauj9gIvkr-6awmo2Z0sKIRfWqt03iXBk-bYUia7oE';

      chai
        .request(server)
        .post('/productsSuppliers')
        .set('access-token', expiredAccessToken)
        .send({})
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.deep.equal({
            errors: ['Token invalide'],
          });
          done();
        });
    });
  });

  describe('DELETE /productSuppliers', () => {
    it('should delete an associtation between a product and a supplier and return a success message', (done) => {
      const productSupplier = { fkProduct: 13, fkSupplier: 3 };

      chai
        .request(server)
        .delete('/productsSuppliers')
        .set('access-token', accessToken)
        .send(productSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message:
              "L'association entre le produit et le fournisseur a été supprimée avec succès",
          });
          done();
        });
    });

    it('should return an error if no associtation exists between a product and a supplier', (done) => {
      const unexistingProductSupplier = { fkProduct: 13, fkSupplier: 1 };

      chai
        .request(server)
        .delete('/productsSuppliers')
        .set('access-token', accessToken)
        .send(unexistingProductSupplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: [
              "L'association entre le produit et le fournisseur n'existe pas",
            ],
          });
          done();
        });
    });
  });
});
