/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");
const bcrypt = require("bcryptjs");
const {expect} = require("chai");
const sandbox = require("sinon").createSandbox();

const passwordService = require(`${appRoot}/src/services/password`);
const {ValidationError} = require(`${appRoot}/src/modules/errors`);

describe("comparePassword", () => {
  beforeEach(() => sandbox.stub(bcrypt, "compare").returns(false));
  afterEach(() => sandbox.restore());

  it("should throw an error if the user password is wrong", async () => {
    try {
      await passwordService.comparePassword("wrongPassword", "$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.");
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError);
    }
  });
});

describe("hashPassword", () => {
  beforeEach(() => sandbox.stub(bcrypt, "compare").returns(true));
  afterEach(() => sandbox.restore());

  it("should return a hashed password using bcrypt", async () => {
    const result = await passwordService.hashPassword("password", 10);
    expect(result).to.not.be.undefined;
    expect(result).to.be.a("string");
    expect(result).to.have.lengthOf(60);
  });
});