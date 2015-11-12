'use strict';

var crypto = require('crypto');

/**
 * Module interface
 */
module.exports = {
  createSalt: createSalt,
  hashPassword: hashPassword,
  createToken: createToken
};

/**
 * Generate a random salt
 */
function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

/**
 * Hash 'salt + password' with sha1 algorith
 */
function hashPassword(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}

/**
 * Generate an URL-safe token
 */
function createToken() {
  return crypto.randomBytes(24).toString('hex');
}
