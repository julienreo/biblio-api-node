import cacheClient from '@modules/cache';
import databaseClient from '@modules/database';
import { server } from '@src/index';
import { getAccessToken } from '@test/utils';
import chai from 'chai';
import chaiHttp from 'chai-http';
import _ from 'lodash';

const { expect } = chai;
chai.use(chaiHttp);

describe('users', () => {
  let accessToken: any;

  before(async () => {
    // Flush cache
    await cacheClient._deleteAll();
    // Restore tables to their default values
    await databaseClient.query('CALL reset_tables();', {});
    accessToken = await getAccessToken();
  });

  describe('GET /users/login', () => {
    it('should log the user in and return him an access token', (done) => {
      chai
        .request(server)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'johndoe@gmail.com',
          password: 'motdepasse',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(_.omit(res.body, 'accessToken')).to.deep.equal({
            success: true,
            message: 'Connexion réussie',
          });
          expect(res.body.accessToken).to.not.be.undefined;
          expect(res.body.accessToken).to.be.a('string');
          done();
        });
    });

    it('should return an error if the provided email is not found', (done) => {
      chai
        .request(server)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'unknownUser@gmail.com',
          password: 'motdepasse',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({
            errors: ["L'utilisateur n'existe pas"],
          });
          done();
        });
    });
  });

  it('should return an error if the provided password is wrong', (done) => {
    chai
      .request(server)
      .post('/users/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'johndoe@gmail.com',
        password: 'wrongPassword',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.deep.equal({
          errors: ['La validation du mot de passe a échoué'],
        });
        done();
      });
  });

  describe('POST /users', () => {
    it('should create a user and return him an access token', (done) => {
      chai
        .request(server)
        .post('/users')
        .set({
          'access-token': accessToken,
          'Content-Type': 'application/json',
        })
        .send({
          firstname: 'John',
          lastname: 'Doe',
          email: 'johndoe2@gmail.com',
          password: 'motdepasse',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(_.omit(res.body, 'accessToken')).to.deep.equal({
            success: true,
            message: 'Utilisateur créé avec succès',
          });
          expect(res.body.accessToken).to.not.be.undefined;
          expect(res.body.accessToken).to.be.a('string');
          done();
        });
    });

    it('should return an error if the access token is missing', (done) => {
      chai
        .request(server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({
          firstname: 'John',
          lastname: 'Doe',
          email: 'johndoe2@gmail.com',
          password: 'motdepasse',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.deep.equal({
            errors: ['Token manquant'],
          });
          done();
        });
    });
  });
});
