module.exports = {
  statusCodes: {
    internalServerError: 500
  },
  dbErrorCodes: {
    duplicateEntryError: 1062,
    foreignKeyConstraintDeleteError: 1451,
    foreignKeyConstraintAddError: 1452
  },
  process: {
    exitCode: {
      success: 0,
      error: 1
    }
  }
};
