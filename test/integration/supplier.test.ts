import cacheClient from '@modules/cache';
import databaseClient from '@modules/database';
import { server } from '@src/index';
import { getAccessToken } from '@test/utils';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

describe('supplier', () => {
  let accessToken: any;

  before(async () => {
    // Flush cache before
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query('CALL reset_tables();', {});
    accessToken = await getAccessToken();
  });

  describe('GET /suppliers/id', () => {
    it('should return the supplier that matches the provided ID', (done) => {
      chai
        .request(server)
        .get('/suppliers/1')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            supplier: {
              id: 1,
              name: 'rs-online',
              website: 'https://fr.rs-online.com',
              notes: 'notes',
              fkCompany: 1,
              creationDate: '2019-11-24T00:00:00.000Z',
            },
          });
          done();
        });
    });

    it('should return an error if no supplier is matching the provided ID', (done) => {
      chai
        .request(server)
        .get('/suppliers/7')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le fournisseur n'existe pas"],
          });
          done();
        });
    });

    it('should return an error if the provided access token is not valid', (done) => {
      const expiredAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY4NTAzMDg4LCJleHAiOjE1Njg1NDYyODh9.Yhauj9gIvkr-6awmo2Z0sKIRfWqt03iXBk-bYUia7oE';

      chai
        .request(server)
        .get('/suppliers/4')
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

  describe('POST /suppliers', () => {
    const supplier = {
      name: 'rs-online-5',
      website: 'http://supplier.com',
      notes: 'notes',
    };

    it('should create a supplier and return a success message', (done) => {
      chai
        .request(server)
        .post('/suppliers')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le fournisseur a été créé avec succès',
            supplierId: 5,
          });
          done();
        });
    });

    it('should create a supplier associated with a product and return a success message', (done) => {
      const supplier = {
        name: 'rs-online-6',
        website: 'http://supplier.com',
        notes: 'notes',
      };

      chai
        .request(server)
        .post('/products/1/suppliers')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le fournisseur a été créé avec succès',
            supplierId: 6,
          });
          done();
        });
    });

    it("should return an error if the product associated with the supplier doesn't exist", (done) => {
      const supplier = {
        name: 'rs-online-7',
        website: 'http://supplier.com',
        notes: 'notes',
      };

      chai
        .request(server)
        .post('/products/14/suppliers')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le produit associé au fournisseur n'existe pas"],
          });
          done();
        });
    });
  });

  describe('PUT /suppliers/id', () => {
    const supplier = {
      name: 'rs-online-bis',
      website: 'http://supplier-bis.com',
    };

    it('should update a supplier and return a success message', (done) => {
      chai
        .request(server)
        .put('/suppliers/1')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le fournisseur a été mis à jour avec succès',
          });
          done();
        });
    });

    it('should return an error if no supplier is matching the provided ID', (done) => {
      chai
        .request(server)
        .put('/suppliers/7')
        .set('access-token', accessToken)
        .send(supplier)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le fournisseur n'existe pas"],
          });
          done();
        });
    });
  });

  describe('DELETE /suppliers/id', () => {
    it('should delete the supplier that matches the provided ID and return a success message', (done) => {
      chai
        .request(server)
        .delete('/suppliers/4')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            success: true,
            message: 'Le fournisseur a été supprimé avec succès',
          });
          done();
        });
    });

    it('should return an error if no supplier is matching the provided ID', (done) => {
      chai
        .request(server)
        .delete('/suppliers/8')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["Le fournisseur n'existe pas"],
          });
          done();
        });
    });

    it('should return an error if products are associated with the supplier to remove', (done) => {
      chai
        .request(server)
        .delete('/suppliers/1')
        .set('access-token', accessToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            errors: ['Des produits sont associés à ce fournisseur'],
          });
          done();
        });
    });
  });
});
