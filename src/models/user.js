const appRoot = require("app-root-path");

const Resource = require(`${appRoot}/src/models/resource`);

class User extends Resource {
  /**
   * @param {Object} data
   */
  constructor(data) {
    super(["firstname", "lastname", "email", "password"], data);
    Object.freeze(this);
  }
}

User.table = "user";

module.exports = User;