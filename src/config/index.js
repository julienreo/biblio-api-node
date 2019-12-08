module.exports = {
  defaultPort: 3000,
  mariaDB: {
    host: "172.17.0.2",
    port: "3306",
    database: "biblio_dev",
    username: "root",
    password: "root"
  },
  bcryptSaltRound: 10,
  jwtSecret: "secret"
};
