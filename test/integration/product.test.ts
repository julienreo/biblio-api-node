import cacheClient from '@modules/cache';
import databaseClient from '@modules/database';
import { server } from '@src/index';
import { getAccessToken } from '@test/utils';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

describe('products', () => {
  let accessToken: any;

  before(async () => {
    // Flush cache
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query('CALL reset_tables();', {});
    accessToken = await getAccessToken();
  });

  describe('GET /products/id', () => {
    it('should return the product that matches the provided ID', (done) => {
      chai
        .request(server)
        .get('/products/1')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            product: {
              id: 1,
              name: 'insert fileté',
              notes: 'notes',
              fkCompany: 1,
              creationDate: '2019-11-24T00:00:00.000Z',
            },
          });
          done();
        });
    });

    it('should return an error if no product is matching the provided ID', (done) => {
      chai
        .request(server)
        .get('/products/14')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le produit n'existe pas"],
          });
          done();
        });
    });

    it('should return an error if the provided access token is not valid', (done) => {
      const expiredAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NTAzMDg4LCJleHAiOjE1Njg1NDYyODh9.Yhauj9gIvkr-6awmo2Z0sKIRfWqt03iXBk-bYUia7oE';

      chai
        .request(server)
        .get('/products/4')
        .set('access-token', expiredAccessToken)
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

  describe('POST /products', () => {
    const product = { name: 'insert fileté 14', notes: 'notes' };

    it('should create a product and return a success message', (done) => {
      chai
        .request(server)
        .post('/products')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le produit a été créé avec succès',
            productId: 14,
          });
          done();
        });
    });

    it('should create a product associated with a supplier and return a success message', (done) => {
      const newProduct = { name: 'insert fileté 15', notes: 'notes' };

      chai
        .request(server)
        .post('/suppliers/1/products')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(newProduct)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le produit a été créé avec succès',
            productId: 15,
          });
          done();
        });
    });

    it("should return an error if the supplier associated with the product doesn't exist", (done) => {
      const newProduct = { name: 'insert fileté 16', notes: 'notes' };

      chai
        .request(server)
        .post('/suppliers/5/products')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(newProduct)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le fournisseur associé au produit n'existe pas"],
          });
          done();
        });
    });
  });

  describe('PUT /products/id', () => {
    const product = { name: 'insert fileté bis' };

    it('should update a product and return a success message', (done) => {
      chai
        .request(server)
        .put('/products/1')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le produit a été mis à jour avec succès',
          });
          done();
        });
    });

    it('should return an error if no product is matching the provided ID', (done) => {
      chai
        .request(server)
        .put('/products/16')
        .set('access-token', accessToken)
        .send(product)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le produit n'existe pas"],
          });
          done();
        });
    });
  });

  describe('DELETE /products/id', () => {
    it('should delete the product that matches the provided ID and return a success message', (done) => {
      chai
        .request(server)
        .delete('/products/2')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le produit a été supprimé avec succès',
          });
          done();
        });
    });

    it('should return an error if no product is matching the provided ID', (done) => {
      chai
        .request(server)
        .delete('/products/16')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le produit n'existe pas"],
          });
          done();
        });
    });
  });
});
