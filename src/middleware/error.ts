import constants from '@config/constants';
import logger from '@lib/logger';
import { AuthenticateRequest } from '@middleware/authenticate';
import { Errors } from '@modules/error';
import { createError } from '@src/modules/error/errorFactory';
import {
  ErrorRequestHandler,
  NextFunction,
  RequestHandler,
  Response,
} from 'express';

/**
 * @param req
 * @param res
 */
const notFound: RequestHandler = (req: AuthenticateRequest, res: Response) => {
  const userId =
    typeof req.accessToken === 'undefined' ? null : req.accessToken.id;
  const error = createError('NotFoundError', "La page demandée n'existe pas");
  logger.error({
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userId,
    error,
  });
  return res.status(error.status).send({ errors: [error.message] });
};

/**
 * @param err
 * @param req
 * @param res
 * @param next
 */
const server: ErrorRequestHandler = (
  err: Errors,
  req: AuthenticateRequest,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const userId =
    typeof req.accessToken === 'undefined' ? null : req.accessToken.id;
  logger.error({
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userId,
    err,
  });
  return res
    .status(err.status || constants.statusCodes.internalServerError)
    .send({ errors: [err.message] });
};

export default {
  notFound,
  server,
};
