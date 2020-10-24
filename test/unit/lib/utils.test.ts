import * as utils from '@lib/utils';
import { expect } from 'chai';

describe('snakeToCamelString', () => {
  it('should convert a snake_case string into a camelCase string', () => {
    const result = utils.snakeToCamelString('snake_case_string');
    expect(result).to.not.be.undefined;
    expect(result).to.equal('snakeCaseString');
  });
});

describe('camelToSnakeString', () => {
  it('should convert a camelCase string into a snake_case string', () => {
    const result = utils.camelToSnakeString('snakeCaseString');
    expect(result).to.not.be.undefined;
    expect(result).to.equal('snake_case_string');
  });
});

describe('snakeToCamelObject', () => {
  it('should convert an object with snake_case keys into an object with camelCase keys', () => {
    const result = utils.snakeToCamelObject({
      snake_case: 1,
      snake_case_again: 2,
    });
    expect(result).to.not.be.undefined;
    expect(result).to.deep.equal({ snakeCase: 1, snakeCaseAgain: 2 });
  });
});

describe('camelToSnakeObject', () => {
  it('should convert an object with camelCase keys into an object with snake_case keys', () => {
    const result = utils.camelToSnakeObject({
      camelCase: 1,
      camelCaseAgain: 2,
    });
    expect(result).to.not.be.undefined;
    expect(result).to.deep.equal({ camel_case: 1, camel_case_again: 2 });
  });
});

describe('sha1', () => {
  it('should calculate and return the SHA-1 hash of a string', () => {
    const result = utils.sha1('string');
    expect(result).to.not.be.undefined;
    expect(result).to.equal('7LJSBEteoPZ57njsGhKQRznikE0=');
  });
});
