import Resource from '@models/resource';

export interface SupplierData {
  name: string;
  website: string;
  notes?: string;
  fkCompany: number;
}

export type SupplierFields = ['name', 'website', 'notes', 'fkCompany'];

export type SupplierFieldsValues = 'name' | 'website' | 'notes' | 'fkCompany';

export default class Supplier extends Resource {
  static table = 'supplier';

  /**
   * @param data
   */
  constructor(data: SupplierData) {
    super(['name', 'website', 'notes', 'fkCompany'], data);
    Object.freeze(this);
  }
}
