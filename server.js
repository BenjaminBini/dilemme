/// <reference path="typings/node/node.d.ts"/>
// Load environment variables
require('dotenv').load();

var express = require('express');
var app = express();
var http = require('http').Server(app);

require('./server/config/mongoose')();

require('./server/config/express')(app);

require('./server/config/passport')();

require('./server/config/routes')(app);

// Log uncaught errors
process.on('uncaughtException', function(err) {
  console.log('UNCAUGHT EXCEPTION : ' + err.stack);
});

// Start app
http.listen(process.env.PORT);
console.log('Application started and listening to ' + process.env.PORT + '...');
