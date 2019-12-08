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
        type: "Nom : format invalide",
        maxLength: "Nom : 50 caractères maximum autorisés",
        minLength: "Nom : 2 caractères minimum autorisés"
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
        type: "Notes : format invalide",
        maxLength: "Notes : 10 000 caractères maximum autorisés"
      }
    }
  },
  errorMessage: {
    required: {
      name: "Le nom est manquant",
      website: "Le site est manquant"
    },
    additionalProperties: "Nombre de champs invalides"
  }
};