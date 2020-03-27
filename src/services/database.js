const appRoot = require("app-root-path");

const {databaseClient} = require(`${appRoot}/src/modules/database`);

/**
 * @param {Function} handler
 */
const makeTransaction = async (handler) => {
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

module.exports = {
  makeTransaction
};