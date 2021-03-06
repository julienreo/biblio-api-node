export default {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 100,
      minLength: 2,
      errorMessage: {
        type: 'Produit : format invalide',
        maxLength: 'Produit : 100 caractères maximum autorisés',
        minLength: 'Produit : 2 caractères minimum autorisés',
      },
    },
    notes: {
      type: 'string',
      maxLength: 10000,
      errorMessage: {
        type: 'Description produit : format invalide',
        maxLength: 'Description produit : 10 000 caractères maximum autorisés',
      },
    },
  },
  errorMessage: {
    required: {
      name: 'Produit : champ obligatoire',
    },
    additionalProperties: 'Champ(s) non autorisé(s)',
  },
};
