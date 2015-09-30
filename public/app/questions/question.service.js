/*jslint newcap: true */
function QuestionService($q, Question, localStorageService) {
  return {
    getAll: function() {
      return Question.query().$promise;
    },
    getPublished: function() {
      return Question.queryPublished().$promise;
    },
    count: function() {
      var dfd = $q.defer();

      Question.count(function(response) {
        dfd.resolve(response.count);
      });

      return dfd.promise;
    },
    getQuestionById: function(id) {
      var dfd = $q.defer();

      Question.get({_id: id}, function(question) {
        dfd.resolve(question);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getUnansweredQuestion: function() {
      var dfd = $q.defer();

      Question.unansweredRandom(function(question) {
        dfd.resolve(question);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getQuestionsByAuthor: function(user) {
      var dfd = $q.defer();

      Question.getByAuthor({_id: user._id}, function(questions) {
        dfd.resolve(questions);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    createQuestion: function(question) {
      var newQuestion = new Question(question);
      var dfd = $q.defer();

      newQuestion.$save().then(function(question) {
        dfd.resolve(question);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    updateQuestion: function(question) {
      var dfd = $q.defer();

      question.$update({_id: question._id}).then(function(question) {
        dfd.resolve(question);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    publishQuestion: function(question) {
      question.status = 1;
      return question.$update({_id: question._id});
    },
    publishQuestions: function(questions) {
      var self = this;
      var dfd = $q.defer();
      var promises = [];
      angular.forEach(questions, function(question) {
        promises.push(self.publishQuestion(question));
      });
      $q.all(promises).then(function() {
        dfd.resolve(questions);
      });
      return dfd.promise;
    },
    unpublishQuestion: function(question) {
      question.status = 0;
      return question.$update({_id: question._id});
    },
    unpublishQuestions: function(questions) {
      var self = this;
      var dfd = $q.defer();
      var promises = [];
      angular.forEach(questions, function(question) {
        promises.push(self.unpublishQuestion(question));
      });
      $q.all(promises).then(function() {
        dfd.resolve(questions);
      });
      return dfd.promise;
    },
    deleteQuestion: function(question) {
      var dfd = $q.defer();

      question.$delete({_id: question._id}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    getProportions: function(question) {
      var firstAnswerVotes = question.answers[0].votes;
      var secondAnswerVotes = question.answers[1].votes;
      var totalVotes = firstAnswerVotes + secondAnswerVotes;

      var firstAnswerProportion;
      var secondAnswerProportion;
      if (totalVotes === 0) {
        firstAnswerProportion = 50;
      } else {
        firstAnswerProportion = Math.round(firstAnswerVotes / totalVotes * 100);
      }
      secondAnswerProportion = 100 - firstAnswerProportion;
      return [firstAnswerProportion, secondAnswerProportion];
    },
    answerQuestion: function(question, answerNumber) {
      var dfd = $q.defer();

      question.$answerQuestion({_id: question._id, answer: answerNumber}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    upvoteQuestion: function(question) {
      var dfd = $q.defer();

      question.$upvoteQuestion({_id: question._id}).then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    commentQuestion: function(question, comment) {
      var dfd = $q.defer();
      var newComment = {
        text: comment
      };
      Question.commentQuestion({_id: question._id}, newComment, function(result) {
        dfd.resolve(result);
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    deleteComment: function(question, commentId) {
      var dfd = $q.defer();

      question.$deleteComment({_id: question._id, _commentId: commentId}, function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    upvoteComment: function(question, commentId) {
      var dfd = $q.defer();

      question.$upvoteComment({_id: question._id, _commentId: commentId}, function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    saveAnswerLocally: function(question, answer) {
      var dfd = $q.defer();

      var anonymousAnswer = {
        question: {
          _id: question._id
        },
        answer: answer
      };
      var anonymousAnswers = localStorageService.get('answers');
      if (!anonymousAnswers) {
        anonymousAnswers = [];
      }
      anonymousAnswers.push(anonymousAnswer);
      localStorageService.set('answers', anonymousAnswers);
      dfd.resolve();

      return dfd.promise;
    }
  };
}

QuestionService.$inject = ['$q', 'Question', 'localStorageService'];
angular.module('app').factory('QuestionService', QuestionService);
