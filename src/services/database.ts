import databaseClient from '@modules/database';
import mysql from 'mysql2/promise';

/**
 * @param handler
 */
const makeTransaction = async (handler: (conn: mysql.PoolConnection) => Promise<void>): Promise<void> => {
  const connection = await databaseClient.pool.getConnection();

  await connection.beginTransaction();

  try {
    await handler(connection);
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
};

export default {
  makeTransaction,
};
