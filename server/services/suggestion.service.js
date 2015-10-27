/**
 * Suggestions service
 */
var Suggestion = require('mongoose').model('Suggestion');
var Question = require('mongoose').model('Question');

/**
 * Return all suggestions
 */
exports.getSuggestions = function(req, res, next) {
  Suggestion.find({}).populate([{
    path: 'author',
    select: 'username',
    model: 'User'
  }]).then(suggestions => res.send(suggestions))
  .catch(err => next(err));
};

/**
 * Return a suggestion by its id
 */
exports.getSuggestionById = function(req, res, next) {
  Suggestion.findOne({_id: req.params.id}).then(function(suggestion) {
    if (!suggestion) {
      throw new Error('SUGGESTION_DOES_NOT_EXIST');
    }
    return suggestion;
  }).then(suggestion => res.send(suggestion))
  .catch(err => next(err));
};

/**
 * Create a new suggestion
 */
exports.createSuggestion = function(req, res, next) {
  // Get the suggestion data from the request
  var suggestionData = req.body;
  suggestionData.author = req.user;

  // Create suggestion
  Suggestion.create(suggestionData)
  .then(suggestion => res.send(suggestion))
  .catch(err => next(err));
};

/**
 * Return the suggestions of a particular user
 */
exports.getSuggestionsByUser = function(req, res, next) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  Suggestion.find({author: req.params.id})
  .then(suggestions => res.send(suggestions))
  .catch(err => next(err));
};

/**
 * Validate a suggestion and publish the question
 */
exports.validateSuggestion = function(req, res, next) {
  var suggestion = req.body;
  if (!suggestion) {
    return next(new Error('SUGGESTION_DOES_NOT_EXIST'));
  }

  suggestion.date = Date.now;

  // Set the i18n data for the question
  suggestion.title = {
    en: suggestion.title,
    fr: suggestion.title
  };
  suggestion.description = {
    en: suggestion.description,
    fr: suggestion.description
  };
  suggestion.text = {
    en: suggestion.text,
    fr: suggestion.text
  };
  suggestion.answers = [{
    text: {
      en: suggestion.answers[0].text,
      fr: suggestion.answers[0].text
    }
  }, {
    text: {
      en: suggestion.answers[1].text,
      fr: suggestion.answers[1].text
    }
  }];

  Suggestion.findOne({_id: suggestion._id})
  .then(function(savedSuggestion) {
    suggestion.author = savedSuggestion.author;
    return Question.create(suggestion);
  }).then(function(question) {
    if (!question) {
      throw new Error();
    }
  }).then(function() {
    res.send();
  }).catch(err => next(err));
};

/**
 * Delete a suggestion
 */
exports.deleteSuggestion = function(req, res, next) {
  Suggestion.remove({_id: req.params.id}).then(function() {
    return res.send(req.params.id);
  }).catch(err => next(err));
};
