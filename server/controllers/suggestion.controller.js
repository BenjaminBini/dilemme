'use strict';

/**
 * Suggestions API controller
 */
var suggestionService = require('../services/suggestion.service');

/**
 * Module interface
 */
module.exports = {
  getSuggestions: getSuggestions,
  getSuggestionById: getSuggestionById,
  getSuggestionsByUser: getSuggestionsByUser,
  createSuggestion: createSuggestion,
  deleteSuggestion: deleteSuggestion,
  validateSuggestion: validateSuggestion
};

/**
 * Return all suggestions
 */
function getSuggestions(req, res, next) {
  suggestionService.getSuggestions()
    .then(suggestions => res.send(suggestions))
    .catch(err => next(err));
}

/**
 * Return a suggestion by its id
 */
function getSuggestionById(req, res, next) {
  var suggestionId = req.params.id;
  suggestionService.getSuggestionById(suggestionId)
    .then(suggestion => res.send(suggestion))
    .catch(err => next(err));
}

/**
 * Return a suggestion by its id
 */
function getSuggestionsByUser(req, res, next) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  var userId = req.params.id;
  suggestionService.getSuggestionsByUser(userId)
    .then(suggestions => res.send(suggestions))
    .catch(err => next(err));
}

/**
 * Create a new suggestion
 */
function createSuggestion(req, res, next) {
  var suggestionData = req.body;
  var user = req.user;

  suggestionService.createSuggestion(suggestionData, user)
    .then(suggestion => res.send(suggestion))
    .catch(err => next(err));
}

/**
 * Delete a suggestion
 */
function deleteSuggestion(req, res, next) {
  var suggestionId = req.params.id;

  suggestionService.deleteSuggestion(suggestionId)
    .then(() => res.send(suggestionId))
    .catch(err => next(err));
}

/**
 * Validate a suggestoin and publish the question
 */
function validateSuggestion(req, res, next) {
  var suggestion = req.body;

  suggestionService.validateSuggestion(suggestion)
    .then(question => res.send(question))
    .catch(err => next(err));
}
