/**
 * Routes configuration
 */

var auth = require('./auth');
var mongoose = require('mongoose');
var users = require('../controllers/users');
var questions = require('../controllers/questions');
var suggestions = require('../controllers/suggestions');
var comments = require('../controllers/comments');

module.exports = function (app) {

  // REST API
  // Users
  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.get('/api/users/:id', auth.requiresRole('admin'), users.getUserById);
  app.post('/api/users', users.createUser);
  app.put('/api/users/:id', users.updateUser);
  app.delete('/api/users/:id', auth.requiresRole('admin'), users.deleteUser);
  app.get('/api/users/:id/suggestions', auth.requiresApiLogin, suggestions.getSuggestionsByUser);
  app.get('/api/users/:id/questions', auth.requiresApiLogin, questions.getQuestionsByAuthor);
  app.get('/api/users/:id/stats', auth.requiresApiLogin, users.getUserStats);

  // Questions
  app.get('/api/questions', questions.getQuestions);
  app.get('/api/questions/tag/:tag', questions.getQuestionsByTag);
  app.get('/api/questions/random', questions.getRandomQuestion);
  app.get('/api/questions/random/unanswered', questions.getUnansweredRandomQuestion);
  app.get('/api/questions/count', questions.count);

  app.get('/api/questions/:id', questions.getQuestionById);
  app.post('/api/questions', auth.requiresRole('admin'), questions.createQuestion);
  app.put('/api/questions/:id', auth.requiresRole('admin'), questions.updateQuestion);
  app.delete('/api/questions/:id', auth.requiresRole('admin'), questions.deleteQuestion);

  app.post('/api/questions/:id/answer/:answer', questions.answerQuestion);
  app.post('/api/questions/:id/upvote', auth.requiresApiLogin, questions.upvoteQuestion);
  app.post('/api/questions/:id/comment/', auth.requiresApiLogin, comments.commentQuestion);
  app.post('/api/questions/:id/comment/:commentId/upvote', auth.requiresApiLogin, comments.upvoteComment);
  app.delete('/api/questions/:id/comment/:commentId', auth.requiresRole('admin'), comments.deleteComment);

  // Suggestions
  app.get('/api/suggestions', auth.requiresRole('admin'), suggestions.getSuggestions);
  app.get('/api/suggestions/:id', auth.requiresRole('admin'), suggestions.getSuggestionById);
  app.post('/api/suggestions/', auth.requiresApiLogin, suggestions.createSuggestion);
  app.post('/api/suggestions/:id/validate', auth.requiresRole('admin'), suggestions.validateSuggestion);
  app.delete('/api/suggestions/:id', auth.requiresRole('admin'), suggestions.deleteSuggestion);

  // Render partials
  app.get('/partials/*', function (req, res) {
    res.render('../../public/app/views/' + req.params[0]);
  });

  // Render directive templates
  app.get('/directives-templates/*', function (req, res) {
    res.render('../../public/app/directives/' + req.params[0]);
  });

  // Auth routes
  app.post('/login', auth.authenticate);
  app.post('/logout', function (req, res) {
    req.logout();
    res.end();
  });

  // Return 404 for undefined api queries
  app.all('/api/*', function (req, res) {
    res.sendStatus(404);
  });

  // Same for Jade files
  app.all('*.jade', function (req, res) {
    res.sendStatus(404);
  });

  // Catch all requests
  app.get('*', function (req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
};
