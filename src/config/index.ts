export default {
  defaultPort: 3000,
  mariaDB: {
    host: '172.17.0.1',
    port: '3306',
    database: 'biblio_dev',
    username: 'root',
    password: 'root',
  },
  redis: {
    host: '172.17.0.1',
    port: '6379',
  },
  bcryptSaltRound: 10,
  jwtSecret: 'secret',
};
