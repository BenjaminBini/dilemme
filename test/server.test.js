/**
 * Config the DB for the tests
 */
require('./utils/db.utils')();

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
