/* eslint-disable no-process-exit */
const appRoot = require("app-root-path");

const ServerError = require(`${appRoot}/src/modules/errors/server`);
const config = require(`${appRoot}/src/config`);
const constants = require(`${appRoot}/src/config/constants`);
const logger = require(`${appRoot}/lib/logger`);
const {db} = require(`${appRoot}/src/modules/database`);

/**
 * Stop HTTP server
 *
 * @param {Server} server
 * @returns {Promise}
 */
const closeServer = (server) => {
  server.close((e) => {
    return new Promise((resolve, reject) => {
      if (e) {
        const error = new ServerError(e.message);
        logger.error({error: error.getMessage()});
        reject(error);
      }
      logger.info("HTTP server stopped successfully");
      resolve();
    });
  });
};

/**
 * Start HTTP server
 *
 * @param {Function} app
 */
const startServer = (app) => {
  const server = app.listen(process.env.PORT || config.defaultPort, () => {
    logger.debug(`Listening on port ${process.env.PORT || config.defaultPort}`);
  });

  // Handle termination signals
  for (const signal of ["SIGINT", "SIGTERM", "SIGQUIT"]) {
    process.on(signal, async () => {
      try {
        await db.closeConnections();
        await closeServer(server);
        process.exit(constants.process.exitCode.success);
      } catch (e) {
        process.exit(constants.process.exitCode.error);
      }
    });
  }
};

module.exports = {
  startServer
};