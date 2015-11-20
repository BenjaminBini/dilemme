'use strict';

/**
 * Suggestions service
 */
var Suggestion = require('mongoose').model('Suggestion');
var Question = require('mongoose').model('Question');
var Promise = require('bluebird');

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
function getSuggestions() {
  return Suggestion.find({})
    .populate([{
      path: 'author',
      select: 'username',
      model: 'User'
    }]);
}

/**
 * Return a suggestion by its id
 */
function getSuggestionById(suggestionId) {
  return Suggestion.findOne({_id: suggestionId})
    .populate([{
      path: 'author',
      select: 'username',
      model: 'User'
    }])
    .then(function(suggestion) {
      if (!suggestion) {
        throw new Error('SUGGESTION_DOES_NOT_EXIST');
      }
      return suggestion;
    });
}

/**
 * Return the suggestions of a particular user
 */
function getSuggestionsByUser(userId) {
  return Suggestion.find({author: userId});
}

/**
 * Create a new suggestion
 */
function createSuggestion(suggestionData, user) {
  suggestionData.author = user;

  // Create suggestion
  return Suggestion.create(suggestionData);
}

/**
 * Delete a suggestion
 */
function deleteSuggestion(suggestionId) {
  return Suggestion.remove({_id: suggestionId});
}

/**
 * Validate a suggestion
 */
function validateSuggestion(suggestion) {
  if (!suggestion) {
    return Promise.reject(new Error('SUGGESTION_DOES_NOT_EXIST'));
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

  return Suggestion.findOne({_id: suggestion._id})
    .then(function(savedSuggestion) {
      suggestion.author = savedSuggestion.author;
      deleteSuggestion(savedSuggestion.id).exec();
      return Question.create(suggestion);
    })
    .then(function(question) {
      if (!question) {
        throw new Error();
      }
      return question;
    });
}
