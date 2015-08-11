var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    dbURI: 'mongodb://localhost/dilemme',
    dbUser: 'dilemme',
    dbPassword: 'dilemme',
    rootPath: rootPath,
    port: 3131
  },
  production: {
    dbURI: 'mongodb://localhost/dilemme',
    dbUser: 'dilemme',
    dbPassword: process.env.MONGO_PASSWORD,
    rootPath: rootPath,
    port: 3131
  }
};