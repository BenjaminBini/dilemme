var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/dilemme',
        rootPath: rootPath,
        port: 3131
    },
    production: {
        db: 'mongodb://localhost/dilemme',
        rootPath: rootPath,
        port: 3131
    }
};