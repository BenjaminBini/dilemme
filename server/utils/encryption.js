var crypto = require('crypto');

/**
 * Generate a random salt
 * @return {[type]} [description]
 */
exports.createSalt = function () {
  return crypto.randomBytes(128).toString('base64');
}

/**
 * Hash 'salt + password' with sha1 algorith 
 * @param  {[type]} salt Salt added to the password
 * @param  {[type]} pwd  Password to hash
 * @return {[type]}      [description]
 */
exports.hashPassword = function (salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}