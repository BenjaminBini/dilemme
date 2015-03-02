/**
 * Express global configuration
 */

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var stylus = require('stylus');
var passport = require('passport');

module.exports = function (app, config) {
  // Set stylus middleware
  app.use(stylus.middleware({
    src: config.rootPath + '/public',
    compile: function (str, path) {
      return stylus(str).set('filename', path);
    }
  }));

  // Parsers
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // Sessions
  app.use(session({
    secret: 'multi vision unicorn',
    resave: false,
    saveUninitialized: false
  }));

  // Passport middlewares
  app.use(passport.initialize());
  app.use(passport.session());

  // Set static middleware for static assets
  app.use(express.static(config.rootPath + '/public'));

  // Set views dir and engine
  app.set('views', config.rootPath + '/server/views');
  app.set('view engine', 'jade');

  // Logger
  app.use(logger('dev'));
};

