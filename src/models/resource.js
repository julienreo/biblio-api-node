const appRoot = require("app-root-path");

const {db} = require(`${appRoot}/src/modules/database`);
const {camelToSnakeObject, snakeToCamelObject} = require(`${appRoot}/lib/utils`);

class Resource {
  /**
   * @param {Array} fields
   * @param {Object} data
   */
  constructor(fields, data) {
    fields.forEach((field) => {
      // If an optional field is not passed
      if (typeof data[field] === "undefined") {
        this[field] = null;
      } else {
        this[field] = data[field];
      }
    });
  }

  /**
   * @param {Object} data
   * @param {Object} options
   * @returns {Object}
   */
  static async findOne(data, options = {}) {
    const {connection} = options;
    const {table} = this;

    const newData = camelToSnakeObject(data);

    const clause = Object.keys(newData).map((key) => `${key} = :${key}`).join(" AND ");

    const sql = `SELECT * FROM ${table} WHERE ${clause}`;

    const res = await db.query(sql, {params: newData, connection});

    return typeof res[0] === "undefined" ? res[0] : snakeToCamelObject(res[0]);
  }

  /**
   * @param {Object} options
   * @returns {Object}
   */
  async save(options = {}) {
    const {connection} = options;
    const {table} = this.constructor;

    const resource = camelToSnakeObject(this);

    const keys = Object.keys(resource);
    const preparedValues = keys.map((item) => `:${item}`);

    const sql = `INSERT INTO ${table} (${keys.join(",")}) VALUES (${preparedValues.join(",")})`;

    return await db.query(sql, {params: resource, connection});
  }

  /**
   * @param {Object} data
   * @param {Object} condition
   * @param {Object} options
   * @returns {Object}
   */
  static async modifyOne(data, condition, options = {}) {
    const {connection} = options;
    const {table} = this;

    const newData = camelToSnakeObject(data);
    const newCondition = camelToSnakeObject(condition);

    const preparedValues = Object.keys(newData).map((key) => `${key} = :${key}`).join(", ");
    const clause = Object.keys(newCondition).map((key) => `${key} = :${key}`).join(" AND ");

    const sql = `UPDATE ${table} SET ${preparedValues} WHERE ${clause}`;

    return await db.query(
      sql,
      {
        params: {...newData, ...newCondition},
        connection
      }
    );
  }

  /**
   * @param {Object} object
   * @param {Object} options
   * @returns {Object}
   */
  static async deleteOne(object, options = {}) {
    const {connection} = options;
    const {table} = this;

    const newObject = camelToSnakeObject(object);

    const condition = Object.keys(newObject).map((key) => `${key} = :${key}`).join(" AND ");

    const sql = `DELETE FROM ${table} WHERE ${condition}`;

    return await db.query(sql, {params: newObject, connection});
  }
}

module.exports = Resource;