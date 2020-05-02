module.exports = {
  type: "object",
  required: ["email", "password"],
  additionalProperties: false,
  properties: {
    email: {
      type: "string",
      format: "email",
      maxLength: 100,
      minLength: 4,
      errorMessage: {
        type: "Email : format invalide",
        format: "Email : format invalide",
        maxLength: "Email : 100 caractères maximum autorisés",
        minLength: "Email : 4 caractères minimum autorisés"
      }
    },
    password: {
      type: "string",
      maxLength: 50,
      minLength: 8,
      errorMessage: {
        type: "Mot de passe : format invalide",
        maxLength: "Mot de passe : 50 caractères maximum autorisés",
        minLength: "Mot de passe : 8 caractères minimum autorisés"
      }
    }
  },
  errorMessage: {
    required: {
      email: "Email : champ obligatoire",
      password: "Mot de passe : champ obligatoire"
    },
    additionalProperties: "Nombre de champs invalides"
  }
};