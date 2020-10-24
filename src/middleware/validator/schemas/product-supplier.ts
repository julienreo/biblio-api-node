export default {
  type: 'object',
  required: ['fkProduct', 'fkSupplier'],
  additionalProperties: false,
  properties: {
    fkProduct: {
      type: 'integer',
      maximum: 10000,
      minimum: 1,
      errorMessage: {
        type: 'Identifiant produit : format invalide',
        maximum: 'Identifiant produit : valeur non autorisée',
        minimum: 'Identifiant produit : valeur non autorisée',
      },
    },
    fkSupplier: {
      type: 'integer',
      maximum: 10000,
      minimum: 1,
      errorMessage: {
        type: 'Identifiant fournisseur : format invalide',
        maximum: 'Identifiant fournisseur : valeur non autorisée',
        minimum: 'Identifiant fournisseur : valeur non autorisée',
      },
    },
    notes: {
      type: 'string',
      maxLength: 10000,
      errorMessage: {
        type: 'Description association produit / fournisseur : format invalide',
        maxLength:
          'Description association produit / fournisseur : 10 000 caractères maximum autorisés',
      },
    },
  },
  errorMessage: {
    required: {
      fkProduct: 'Identifiant produit : champ obligatoire',
      fkSupplier: 'Identifiant fournisseur : champ obligatoire',
    },
    additionalProperties: 'Champ(s) non autorisé(s)',
  },
};
