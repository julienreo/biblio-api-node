const appRoot = require("app-root-path");

const {db} = require(`${appRoot}/src/modules/database`);

/**
 * @param {Function} handler
 */
const makeTransaction = async (handler) => {
  const connection = await db.pool.getConnection();

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