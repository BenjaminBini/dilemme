var crypto = require('crypto');

/**
 * Generate a random salt
 */
exports.createSalt = function() {
  return crypto.randomBytes(128).toString('base64');
};

/**
 * Hash 'salt + password' with sha1 algorith
 */
exports.hashPassword = function(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
};


/**
 * Generate an URL-safe token
 */
exports.createToken = function() {
  return crypto.randomBytes(24).toString('hex');
};
