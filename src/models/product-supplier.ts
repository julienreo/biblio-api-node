import Resource from '@models/resource';

export interface ProductSupplierData {
  fkProduct: number;
  fkSupplier: number;
  fkCompany: number;
  notes?: string;
}

export type ProductSupplierFields = [
  'fkProduct',
  'fkSupplier',
  'fkCompany',
  'notes'
];

export type ProductSupplierFieldsValues =
  | 'fkProduct'
  | 'fkSupplier'
  | 'fkCompany'
  | 'notes';

/**
 * Model that represents the association between a product and a supplier
 */
export default class ProductSupplier extends Resource {
  static table = 'at_product_supplier';

  /**
   * @param data
   */
  constructor(data: ProductSupplierData) {
    super(['fkProduct', 'fkSupplier', 'fkCompany', 'notes'], data);
    Object.freeze(this);
  }
}
