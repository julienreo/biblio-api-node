import config from '@config/index';
import logger from '@lib/logger';
import { AuthenticateRequest } from '@middleware/authenticate';
import authenticationService from '@services/authentication';
import passwordService from '@services/password';
import resourceService from '@services/resource';
import { NextFunction, Request, Response } from 'express';

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;

    const user = (await resourceService.retrieveOne(
      'user',
      { email: userData.email.toLowerCase() },
      "L'utilisateur n'existe pas"
    )) as {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      fkCompany: number;
      creationDate: Date;
    };

    await passwordService.comparePassword(userData.password, user.password);

    const accessToken = await authenticationService.getAccessToken(
      user.id,
      user.fkCompany
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userEmail: user.email,
    });
    res.send({ success: true, message: 'Connexion réussie', accessToken });
  } catch (e) {
    return next(e);
  }
};

const create = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;
    const { companyId } = req.accessToken;

    userData.fkCompany = companyId;
    userData.password = await passwordService.hashPassword(
      userData.password,
      config.bcryptSaltRound
    );

    const userId = await resourceService.insertOne(
      'user',
      userData,
      "L'utilisateur existe déjà"
    );

    const accessToken = await authenticationService.getAccessToken(
      userId,
      companyId
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userEmail: userData.email,
    });
    res.send({
      success: true,
      message: 'Utilisateur créé avec succès',
      accessToken,
    });
  } catch (e) {
    return next(e);
  }
};

export default {
  login,
  create,
};
