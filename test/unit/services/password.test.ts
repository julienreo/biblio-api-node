import { ValidationError } from '@modules/error';
import passwordService from '@services/password';
import bcrypt from 'bcryptjs';
import { expect } from 'chai';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('comparePassword', () => {
  beforeEach(() => sandbox.stub(bcrypt, 'compare').callsFake(() => false));
  afterEach(() => sandbox.restore());

  it('should throw an error if the user password is wrong', async () => {
    try {
      await passwordService.comparePassword(
        'wrongPassword',
        '$2a$10$1dQGvNBMTEavBOnmU9LsHeurKaPCrFydTMlfYBnSi2cE2V/exQXC.'
      );
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError);
    }
  });
});

describe('hashPassword', () => {
  beforeEach(() => sandbox.stub(bcrypt, 'compare').callsFake(() => true));
  afterEach(() => sandbox.restore());

  it('should return a hashed password using bcrypt', async () => {
    const result = await passwordService.hashPassword('password', 10);
    expect(result).to.not.be.undefined;
    expect(result).to.be.a('string');
    expect(result).to.have.lengthOf(60);
  });
});
