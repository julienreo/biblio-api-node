const appRoot = require("app-root-path");
const mysql = require("mysql2/promise");

const config = require(`${appRoot}/src/config`);
const {FormatQueryError, CloseConnectionsError} = require(`${appRoot}/src/modules/errors`);
const logger = require(`${appRoot}/lib/logger`);

/**
 * Format the SQL query to match the format expected by the database driver
 *
 * @param {string} sql
 * @param {Object} params
 * @returns {Object}
 */
const formatQuery = (sql, params) => {
  let formattedQuery = sql;

  const formattedParams = [];
  for (let i = 0; i < Object.entries(params).length; i++) {
    formattedQuery = formattedQuery.replace(/:(\w*)/u, (match, p1) => {
      // If p1 is not a property of params object
      if (typeof params[p1] === "undefined") {
        throw new FormatQueryError(p1);
      }
      formattedParams.push(params[p1]);
      return "?";
    });
  }

  return {
    sql: formattedQuery,
    params: formattedParams
  };
};

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MARIADB_HOST || config.mariaDB.host,
      port: process.env.MARIADB_PORT || config.mariaDB.port,
      user: process.env.MARIADB_USER || config.mariaDB.username,
      password: process.env.MARIADB_PASSWORD || config.mariaDB.password,
      database: process.env.MARIADB_DATABASE || config.mariaDB.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    Object.freeze(this);
  }

  /**
   * @param {string} sql
   * @param {Object} options
   * @returns {Object}
   */
  async query(sql, options) {
    const {params} = options;
    const connection = options.connection ? options.connection : this.pool;

    if (params) {
      // Prepared statements
      const formattedQuery = formatQuery(sql, params);
      const [res] = await connection.execute(formattedQuery.sql, formattedQuery.params);
      return res;
    }

    const [res] = await connection.query(sql);
    return res;
  }

  async closeConnections() {
    try {
      await this.pool.end;
      logger.info("Database connections closed successfully");
    } catch (e) {
      const error = new CloseConnectionsError(e.message);
      logger.error({error: error.getMessage()});
      throw error;
    }
  }
}

module.exports = {
  databaseClient: new Database(),
  formatQuery
};