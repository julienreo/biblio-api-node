import constants from '@config/constants';
import config from '@config/index';
import logger from '@lib/logger';
import databaseClient from '@modules/database';
import { createError } from '@src/modules/errors/index';
import { Application } from 'express';
import { Server } from 'http';

/**
 * Stop HTTP server
 *
 * @param server
 */
const closeServer = (server: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((e) => {
      if (e) {
        const error = createError('ServerError', e.message);
        logger.error({ errors: [error.message] });
        reject(error);
      }
      logger.info('HTTP server successfully stopped');
      resolve();
    });
  });

/**
 * Start HTTP server
 *
 * @param app
 */
const startServer = (app: Application): Server => {
  const server = app.listen(process.env.PORT || config.defaultPort, () => {
    logger.debug(`Listening on port ${process.env.PORT || config.defaultPort}`);
  });

  // Handle termination signals
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].reduce(
    (p, signal) =>
      p.then(() =>
        process.on(signal, async () => {
          try {
            await databaseClient.closeConnections();
            await closeServer(server);
            process.exit(constants.process.exitCode.success);
          } catch (e) {
            process.exit(constants.process.exitCode.error);
          }
        })
      ),
    Promise.resolve()
  );

  return server;
};

export default startServer;
