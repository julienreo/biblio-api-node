const crypto = require("crypto");

/**
 * Convert a camelCase string into a snake_case string
 *
 * @param {string} str
 * @returns {string}
 */
const camelToSnakeString = (str) => {
  return str.replace(/([A-Z])/gu, (match, p1) => {
    return `_${p1.toLowerCase()}`;
  });
};

/**
 * Convert a snake_case string into a camelCase string
 *
 * @param {string} str
 * @returns {string}
 */
const snakeToCamelString = (str) => {
  return str.replace(/(_[a-z])/gu, (match, p1) => {
    return `${p1.replace(/_/gu, "").toUpperCase()}`;
  });
};

/**
 * Convert an object with camelCase keys into an object with snake_case keys
 *
 * @param {Object} object
 * @returns {Object}
 */
const camelToSnakeObject = (object) => {
  const newObject = {};

  for (const [key, value] of Object.entries(object)) {
    newObject[camelToSnakeString(key)] = value;
  }

  return newObject;
};

/**
 * Convert an object with snake_case keys into an object with camelCase keys
 *
 * @param {Object} object
 * @returns {Object}
 */
const snakeToCamelObject = (object) => {
  const newObject = {};

  for (const [key, value] of Object.entries(object)) {
    newObject[snakeToCamelString(key)] = value;
  }

  return newObject;
};

/**
 * Calculate and return the SHA-1 hash of a string
 *
 * @param {string} str
 * @returns {string}
 */
const sha1 = (str) => {
  return crypto.createHash("sha1").update(str, "utf-8").digest("base64");
};

module.exports = {
  camelToSnakeObject,
  snakeToCamelObject,
  camelToSnakeString,
  snakeToCamelString,
  sha1
};