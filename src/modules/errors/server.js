class ServerError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
  }

  /**
   * @returns {Object}
   */
  getMessage() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

module.exports = ServerError;