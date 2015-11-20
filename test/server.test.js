/**
 * Config the DB for the tests
 */
require('./utils/db.utils')();

/**
 * Test Encryption util
 */
require('./server/utils/encryption.test.js')();

/**
 * Test User model
 */
require('./server/models/user.model.test.js')();

/**
 * Test Question model
 */
require('./server/models/question.model.test.js')();

/**
 * Test Suggestion model
 */
require('./server/models/suggestion.model.test.js')();

/**
 * Test Suggestion service
 */
require('./server/services/suggestion.service.test.js')();

