module.exports = {
  type: "object",
  required: ["fkProduct", "fkSupplier"],
  additionalProperties: false,
  properties: {
    fkProduct: {
      type: "integer",
      maximum: 10000,
      minimum: 1,
      errorMessage: {
        type: "fkProduct : format invalide",
        maximum: "maximum : valeur non autorisée",
        minimum: "minimum : valeur non autorisée"
      }
    },
    fkSupplier: {
      type: "integer",
      maximum: 10000,
      minimum: 1,
      errorMessage: {
        type: "fkSupplier : format invalide",
        maximum: "maximum : valeur non autorisée",
        minimum: "minimum : valeur non autorisée"
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
      fkProduct: "L'ID du produit est manquant",
      fkSupplier: "L'ID du fournisseur est manquant"
    },
    additionalProperties: "Nombre de champs invalides"
  }
};