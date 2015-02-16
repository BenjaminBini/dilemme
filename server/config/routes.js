/**
 * Routes configuration
 */

var auth = require('./auth');
var mongoose = require('mongoose');
var users = require('../controllers/users');
var questions = require('../controllers/questions');

module.exports = function(app) {

	// REST API
	// Users
	app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
	app.get('/api/users/:id', auth.requiresRole('admin'), users.getUserById);
	app.post('/api/users', users.createUser);
	app.put('/api/users/:id', users.updateUser);
	app.delete('/api/users/:id', auth.requiresRole('admin'), users.deleteUser);

	// Questions
	app.get('/api/questions', questions.getQuestions);
	app.get('/api/questions/tag/:tag', questions.getQuestionsByTag);
	app.get('/api/questions/random', questions.getRandomQuestion);

	app.get('/api/questions/:id', questions.getQuestionById);
	app.post('/api/questions', auth.requiresRole('admin'), questions.createQuestion);
	app.put('/api/questions/:id', auth.requiresRole('admin'), questions.updateQuestion);
	app.delete('/api/questions/:id', auth.requiresRole('admin'), questions.deleteQuestion);

	// Answers
	app.post('/api/questions/:id/answer/:answer', auth.requiresApiLogin, questions.answerQuestion);


	// Render partials
	app.get('/partials/*', function (req, res) {
		res.render('../../public/app/views/' + req.params[0]);
	});

	// Render directive templates
	app.get('/directives-templates/*', function (req, res) {
		res.render('../../public/app/directives/' + req.params[0]);
	})
	
	// Auth routes
	app.post('/login', auth.authenticate);
	app.post('/logout', function(req, res) {
		req.logout();
		res.end();
	});

	// Return 404 for undefined api queries
	app.all('/api/*', function(req, res) {
		res.sendStatus(404);
	});

	// Same for Jade files
	app.all('*.jade', function(req, res) {
		res.sendStatus(404);
	})

	// Catch all requests
	app.get('*', function (req, res) {
		res.render('index', {
			bootstrappedUser: req.user
		});
	});
};