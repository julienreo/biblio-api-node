module.exports = {
  type: "object",
  required: ["name", "website"],
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      maxLength: 50,
      minLength: 2,
      errorMessage: {
        type: "Fournisseur : format invalide",
        maxLength: "Fournisseur : 50 caractères maximum autorisés",
        minLength: "Fournisseur : 2 caractères minimum autorisés"
      }
    },
    website: {
      type: "string",
      maxLength: 200,
      minLength: 4,
      errorMessage: {
        type: "Site : format invalide",
        maxLength: "Site : 200 caractères maximum autorisés",
        minLength: "Site : 4 caractères minimum autorisés"
      }
    },
    notes: {
      type: "string",
      maxLength: 10000,
      errorMessage: {
        type: "Description fournisseur : format invalide",
        maxLength: "Description fournisseur : 10 000 caractères maximum autorisés"
      }
    }
  },
  errorMessage: {
    required: {
      name: "Fournisseur : champ obligatoire",
      website: "Site : champ obligatoire"
    },
    additionalProperties: "Nombre de champs invalides"
  }
};