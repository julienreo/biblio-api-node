import cacheClient from '@modules/cache';
import chai from 'chai';
import redis from 'redis';
import sinon from 'sinon';

const redisClient = redis.createClient();
const sandbox = sinon.createSandbox();
const { expect } = chai;

describe('find', () => {
  const dataToRetrieve = {
    id: 1,
    name: 'insert fileté',
    notes: 'notes',
    fkCompany: 1,
    creationDate: '2019-11-24T00:00:00.000Z',
  };
  const cacheClientError: any = null;
  const cacheClientResponse = JSON.stringify(dataToRetrieve);

  beforeEach(() => {
    sandbox
      .stub(Object.getPrototypeOf(redisClient), 'get')
      .callsArgWith(1, cacheClientError, cacheClientResponse);
  });
  afterEach(() => sandbox.restore());

  it('should parse the data retrieved from the cache before returning it', async () => {
    const result = await cacheClient.find('5PiBG0g0ON31GYYP3HzdXlJ5oEE=');
    expect(result).to.not.be.undefined;
    expect(result).to.deep.equal(dataToRetrieve);
  });
});
