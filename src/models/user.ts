import Resource from '@models/resource';

export interface UserRecord {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  fkCompany: number;
  creationDate: Date;
}

export interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  fkCompany?: number;
}

export type UserFields = ['firstname', 'lastname', 'email', 'password', 'fkCompany'];

export type UserFieldsValues = 'firstname' | 'lastname' | 'email' | 'password' | 'fkCompany';

export default class User extends Resource {
  static table = 'user';

  /**
   * @param data
   */
  constructor(data: UserData) {
    super(['firstname', 'lastname', 'email', 'password', 'fkCompany'], data);
    Object.freeze(this);
  }
}
