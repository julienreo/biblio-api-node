import { createError } from '@src/modules/errors/index';
import bcrypt from 'bcryptjs';

/**
 * @param suppliedPassword
 * @param userPassword
 */
const comparePassword = async (suppliedPassword: string, userPassword: string): Promise<void> => {
  const passwordMatch = await bcrypt.compare(suppliedPassword, userPassword);

  if (passwordMatch === false) {
    throw createError('ValidationError', 'La validation du mot de passe a échoué');
  }
};

/**
 * @param userPassword
 * @param salt
 */
const hashPassword = async (userPassword: string, salt: number): Promise<string> =>
  await bcrypt.hash(userPassword, salt);

export default {
  comparePassword,
  hashPassword,
};
