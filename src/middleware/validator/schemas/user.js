module.exports = {
  type: "object",
  required: ["firstname", "lastname", "email", "password"],
  additionalProperties: false,
  properties: {
    firstname: {
      type: "string",
      maxLength: 50,
      minLength: 2,
      errorMessage: {
        type: "Prénom : format invalide",
        maxLength: "Prénom : 50 caractères maximum autorisés",
        minLength: "Prénom : 2 caractères minimum autorisés"
      }
    },
    lastname: {
      type: "string",
      maxLength: 50,
      minLength: 2,
      errorMessage: {
        type: "Nom : format invalide",
        maxLength: "Nom : 50 caractères maximum autorisés",
        minLength: "Nom : 2 caractères minimum autorisés"
      }
    },
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
      firstname: "Prénom : champ obligatoire",
      lastname: "Nom : champ obligatoire",
      email: "Email : champ obligatoire",
      password: "Mot de passe : champ obligatoire"
    },
    additionalProperties: "Nombre de champs invalides"
  }
};