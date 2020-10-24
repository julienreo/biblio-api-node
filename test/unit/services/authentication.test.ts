import authenticationService from '@services/authentication';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('getAccessToken', () => {
  beforeEach(() => sandbox.stub(jwt, 'sign').callsFake(() => 'JWT'));
  afterEach(() => sandbox.restore());

  it('should return a JWT', async () => {
    const result = await authenticationService.getAccessToken(1, 1);
    expect(result).to.not.be.undefined;
    expect(result).to.be.a('string');
  });
});
