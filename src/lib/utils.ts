import crypto from 'crypto';

/**
 * Convert a camelCase string into a snake_case string
 *
 * @param str
 */
export const camelToSnakeString = (str: string): string =>
  str.replace(/([A-Z])/gu, (match, p1) => `_${p1.toLowerCase()}`);

/**
 * Convert a snake_case string into a camelCase string
 *
 * @param str
 */
export const snakeToCamelString = (str: string): string =>
  str.replace(/(_[a-z])/gu, (match, p1) => `${p1.replace(/_/gu, '').toUpperCase()}`);

/**
 * Convert an object with camelCase keys into an object with snake_case keys
 *
 * @param object
 */
export const camelToSnakeObject = (object: { [key: string]: string | number }): { [key: string]: string | number } =>
  Object.entries(object).reduce((acc, [k, v]) => {
    acc[camelToSnakeString(k)] = v;
    return acc;
  }, {} as { [key: string]: string | number });

/**
 * Convert an object with snake_case keys into an object with camelCase keys
 *
 * @param object
 */
export const snakeToCamelObject = (object: {
  [key: string]: string | number | Date;
}): { [key: string]: string | number | Date } =>
  Object.entries(object).reduce((acc, [k, v]) => {
    acc[snakeToCamelString(k)] = v;
    return acc;
  }, {} as { [key: string]: string | number | Date });

/**
 * Calculate and return the SHA-1 hash of a string
 *
 * @param str
 */
export const sha1 = (str: string): string => crypto.createHash('sha1').update(str, 'utf8').digest('base64');
