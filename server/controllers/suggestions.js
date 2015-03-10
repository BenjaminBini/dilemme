/**
 * Suggestions controller
 */
var Suggestion = require('mongoose').model('Suggestion');

/**
 * Return all suggestions
 * @param  {[type]} req Request
 * @param  {[type]} res Response
 * @return {[type]}     
 */
exports.getSuggestions = function (req, res) {
  Suggestion.find({}).exec(function (err, collection) {
    if (err) {
      return;
    }
    return res.send(collection);
  });
};

/**
 * Return a suggestion by its id
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @return {[type]}      
 */
exports.getSuggestionById = function (req, res) {
  Suggestion.findOne({_id: req.params.id}).exec(function (err, suggestion) {
    if (err) {
      return res.sendStatus(400);
    }
    suggestion.populateSuggestion().then(function () {
      return res.send(suggestion);
    });
  });
};

/**
 * Create a new suggestion
 * @param  {[type]}   req  Request
 * @param  {[type]}   res  Response
 * @param  {Function} next Next
 * @return {[type]}        
 */
exports.createSuggestion = function (req, res) {
  // Get the suggestion data from the request
  var suggestionData = req.body;
  suggestionData.author = req.user;

  // Create question
  Suggestion.create(suggestionData, function (err, suggestion) {
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
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getSuggestionsByUser = function (req, res) {
  // Check if the user is authorized (admin or current user)
  if (req.user._id != req.params.id && !req.user.hasRole('admin')) {
    res.status(403);
    return res.send();
  }

  Suggestion.find({author: req.params.id}).exec(function (err, collection) {
    if (err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(collection);
  });
};