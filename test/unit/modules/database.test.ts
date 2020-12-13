import databaseClient, { formatQuery } from '@modules/database';
import { FormatQueryError } from '@modules/error';
import { expect } from 'chai';
import sinon from 'sinon';
const { PromisePool } = require('../../../node_modules/mysql2/promise');

const sandbox = sinon.createSandbox();

describe('formatQuery', () => {
  it('should format the SQL query so that the database engine can execute it', () => {
    const result = formatQuery('SELECT * FROM user WHERE email = :email', {
      email: 'johndoe@gmail.com',
    });
    expect(result).to.not.be.undefined;
    expect(result).to.deep.equal({
      sql: 'SELECT * FROM user WHERE email = ?',
      params: ['johndoe@gmail.com'],
    });
  });

  it('should throw an error if columns names in the SQL query are not passed as parameters to the function', () => {
    try {
      formatQuery('SELECT * FROM user WHERE email = :email', { name: 'john' });
    } catch (e) {
      expect(e).to.be.instanceof(FormatQueryError);
    }
  });
});

describe('query', () => {
  describe('with parameters passed to the function', () => {
    const executionResult = [
      [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'johndoe@gmail.com',
          password:
            '$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.',
          creation_date: '2019-11-23T22:36:34.000Z',
        },
      ],
    ];

    beforeEach(() =>
      sandbox
        .stub(PromisePool.prototype, 'execute')
        .callsFake(() => executionResult)
    );
    afterEach(() => sandbox.restore());

    it('should return the result of the execution of a query', async () => {
      const result = await databaseClient.query(
        'SELECT * FROM user WHERE email = :email',
        { params: { email: 'johndoe@gmail.com' } }
      );
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(executionResult[0]);
    });
  });

  describe('without parameters passed to the function', () => {
    const executionResult = [
      [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'johndoe@gmail.com',
          password:
            '$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.',
          creation_date: '2019-11-23T22:36:34.000Z',
        },
      ],
    ];

    beforeEach(() =>
      sandbox
        .stub(PromisePool.prototype, 'query')
        .callsFake(() => executionResult)
    );
    afterEach(() => sandbox.restore());

    it('should return the result of the execution of a query', async () => {
      const result = await databaseClient.query('SELECT * FROM user', {});
      expect(result).to.not.be.undefined;
      expect(result).to.deep.equal(executionResult[0]);
    });
  });
});
