/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const redis = require("redis");
const chai = require("chai");
const {expect} = chai;
const sinon = require("sinon");
const sandbox = sinon.createSandbox();

const {cacheClient} = require(`${appRoot}/src/modules/cache`);
const redisClient = redis.createClient();

describe("find", () => {
  const dataToRetrieve = {
    id: 1,
    name: "insert fileté",
    notes: "notes",
    fkCompany: 1,
    creationDate: "2019-11-24T00:00:00.000Z"
  };
  const cacheClientError = null;
  const cacheClientResponse = JSON.stringify(dataToRetrieve);

  beforeEach(() => {
    sandbox.stub(Object.getPrototypeOf(redisClient), "get")
      .callsArgWith(1, cacheClientError, cacheClientResponse);
  });
  afterEach(() => sandbox.restore());

  it("should parse the data retrieved from the cache before returning it", async () => {
    const result = await cacheClient.find("5PiBG0g0ON31GYYP3HzdXlJ5oEE=");
    expect(result).to.not.be.undefined;
    expect(result).to.deep.equal(dataToRetrieve);
  });
});