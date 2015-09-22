/**
 * Suggestions service
 */
var Suggestion = require('mongoose').model('Suggestion');
var Question = require('mongoose').model('Question');

/**
 * Return all suggestions
 */
exports.getSuggestions = function(req, res) {
  Suggestion.find({}).populate([{
    path: 'author',
    select: 'username',
    model: 'User'
  }]).exec(function(err, collection) {
    if (err) {
      return;
    }
    return res.send(collection);
  });
};

/**
 * Return a suggestion by its id
 */
exports.getSuggestionById = function(req, res) {
  Suggestion.findOne({_id: req.params.id}).exec(function(err, suggestion) {
    if (err || !suggestion) {
      if (err) {
        console.log(err.stack);
      }
      res.status(400);
      return res.send({reason: 'SUGGESTION_DOES_NOT_EXIST'});
    }
    suggestion.populateSuggestion().then(function() {
      return res.send(suggestion);
    });
  });
};

/**
 * Create a new suggestion
 */
exports.createSuggestion = function(req, res) {
  // Get the suggestion data from the request
  var suggestionData = req.body;
  suggestionData.author = req.user;

  // Create question
  Suggestion.create(suggestionData, function(err, suggestion) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    // If no error, return the question
    return res.send(suggestion);
  });
};

/**
 * Return the suggestions of a particular user
 */
exports.getSuggestionsByUser = function(req, res) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) { // jshint ignore:line
    res.status(403);
    return res.send();
  }

  Suggestion.find({author: req.params.id}).exec(function(err, collection) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(collection);
  });
};

/**
 * Validate a suggestion and publish the question
 */
exports.validateSuggestion = function(req, res) {
  var suggestion = req.body;
  if (!suggestion) {
    res.status(400);
    return res.send({reason: 'SUGGESTION_DOES_NOT_EXIST'});
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

  Suggestion.findOne({_id: suggestion._id}, function(err, savedSuggestion) {
    suggestion.author = savedSuggestion.author;
    Question.create(suggestion, function(err, question) {
      if (!question || err) {
        if (err) {
          console.log(err.stack);
        }
        res.status(400);
        return res.send();
      }
      Suggestion.remove({_id: suggestion._id}, function(err) {
        if (err) {
          console.log(err.stack);
          res.status(400);
          return res.send();
        }
        return res.send(question);
      });
    });
  });
};

/**
 * Delete a suggestion
 */
exports.deleteSuggestion = function(req, res) {
  Suggestion.remove({_id: req.params.id}, function(err) {
    if (err) {
      console.log(err.stack);
      res.status(400);
      return res.send();
    }
    return res.send(req.params.id);
  });
};
