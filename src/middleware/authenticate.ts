import config from '@config/index';
import { InvalidTokenError, MissingTokenError } from '@modules/errors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AccessToken {
  companyId: number;
  exp: number;
  iat: number;
  id: number;
}

export interface AuthenticateRequest extends Request {
  accessToken: AccessToken;
}

/**
 * @param req
 * @param res
 * @param next
 */
const authenticate: RequestHandler = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers['access-token'] as string;

  if (typeof accessToken === 'undefined') {
    return next(new MissingTokenError('Token manquant'));
  }

  try {
    req.accessToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET || config.jwtSecret
    ) as AccessToken;
  } catch (e) {
    return next(new InvalidTokenError('Token invalide'));
  }

  return next();
};

export default {
  authenticate,
};
