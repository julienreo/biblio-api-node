import config from '@config/index';
import logger from '@lib/logger';
import { createError } from '@src/modules/errors/index';
import mysql from 'mysql2/promise';

export interface QueryOptions {
  params?: {
    [key: string]: string | number;
  };
  connection?: mysql.PoolConnection;
}

/**
 * Format the SQL query to match the format expected by the database driver
 *
 * @param sql
 * @param params
 */
export const formatQuery = (
  sql: string,
  params: { [key: string]: string | number }
): { sql: string; params: (string | number)[] } => {
  let formattedQuery = sql;

  const formattedParams: (string | number)[] = [];
  formattedQuery = formattedQuery.replace(/:(\w*)/gu, (match, p1) => {
    // If p1 is not a property of params object
    if (typeof params[p1] === 'undefined') {
      throw createError('FormatQueryError', p1);
    }
    formattedParams.push(params[p1]);
    return '?';
  });

  return {
    sql: formattedQuery,
    params: formattedParams,
  };
};

class Database {
  pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MARIADB_HOST || config.mariaDB.host,
      port: parseInt(process.env.MARIADB_PORT) || parseInt(config.mariaDB.port),
      user: process.env.MARIADB_USER || config.mariaDB.username,
      password: process.env.MARIADB_PASSWORD || config.mariaDB.password,
      database: process.env.MARIADB_DATABASE || config.mariaDB.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    Object.freeze(this);
  }

  /**
   * @param sql
   * @param options
   */
  async query(
    sql: string,
    options: QueryOptions
  ): Promise<
    | mysql.RowDataPacket[]
    | mysql.RowDataPacket[][]
    | mysql.OkPacket
    | mysql.OkPacket[]
    | mysql.ResultSetHeader
  > {
    const { params } = options;
    const connection = options.connection ? options.connection : this.pool;

    if (params) {
      // Prepared statements
      const formattedQuery = formatQuery(sql, params);
      const [res] = await connection.execute(
        formattedQuery.sql,
        formattedQuery.params
      );
      return res;
    }

    const [res] = await connection.query(sql);
    return res;
  }

  async closeConnections() {
    try {
      await this.pool.end();
      logger.info('Database connections closed successfully');
    } catch (e) {
      const error = createError('CloseConnectionsError', e.message);
      logger.error({ errors: [error.message] });
      throw error;
    }
  }
}

export default new Database();
