import config from '@config/index';
import jwt from 'jsonwebtoken';

/**
 * @param userId
 * @param fkCompany
 */
const getAccessToken = async (
  userId: number,
  fkCompany: number
): Promise<string> =>
  await jwt.sign(
    { id: userId, companyId: fkCompany },
    process.env.JWT_SECERT || config.jwtSecret,
    { expiresIn: '12h' }
  );

export default {
  getAccessToken,
};
