/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const {expect} = require("chai");
const sandbox = require("sinon").createSandbox();
const jwt = require("jsonwebtoken");

const authenticationService = require(`${appRoot}/src/services/authentication`);

describe("getAccessToken", () => {
  before(() => sandbox.stub(jwt, "sign").returns("JWT"));
  after(() => sandbox.restore());

  it("should return a JWT", async () => {
    const result = await authenticationService.getAccessToken(1);
    expect(result).to.not.be.undefined;
    expect(result).to.be.a("string");
  });
});