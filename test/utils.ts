import authenticationService from '@services/authentication';

export const getAccessToken = async (): Promise<string> =>
  await authenticationService.getAccessToken(1, 1);
