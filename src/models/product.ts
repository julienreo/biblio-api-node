import Resource from '@models/resource';

export interface ProductData {
  name: string;
  notes?: string;
  fkCompany: number;
}

export type ProductFields = ['name', 'notes', 'fkCompany'];

export type ProductFieldsValues = 'name' | 'notes' | 'fkCompany';

export default class Product extends Resource {
  static table = 'product';

  /**
   * @param data
   */
  constructor(data: ProductData) {
    super(['name', 'notes', 'fkCompany'], data);
    Object.freeze(this);
  }
}
