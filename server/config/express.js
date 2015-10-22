/**
 * Express global configuration
 */
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = function(app) {

  // Parsers
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // Sessions
  var store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });

  app.use(session({
    secret: 'multi vision unicorn',
    resave: false,
    saveUninitialized: false,
    store: store
  }));

  // Passport middlewares
  app.use(passport.initialize());
  app.use(passport.session());

  // Set static middleware for static assets
  app.use(express.static(rootPath + 'public'));

  // Set views dir and engine (only for server rendered views : index / layout / current-user)
  app.set('views', rootPath + '/server/views');
  app.set('view engine', 'jade');

  // Logger
  app.use(logger('dev'));
};

