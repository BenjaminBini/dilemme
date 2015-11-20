/// <reference path="typings/node/node.d.ts"/>
// Load environment variables
require('dotenv').load();

var express = require('express');
var app = express();
var http = require('http').Server(app);

// Configure DB connection and models
require('./server/config/mongoose')();

// Configure app (common middlewares)
require('./server/config/express')(app);

// Configure passport authentication methods
require('./server/config/passport')();

// Configure routes
require('./server/config/routes')(app);

// Log uncaught errors
process.on('uncaughtException', function(err) {
  console.log('UNCAUGHT EXCEPTION : ' + err.stack);
});

// Start app
http.listen(process.env.PORT);
console.log('Application started and listening to ' + process.env.PORT + '...');
