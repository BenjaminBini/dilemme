function UnansweredQuestionRandomController($location, Question) {
  // Redirect to random question page
  var question = Question.unansweredRandom(function() {
    $location.path('/questions/' + question._id);
  });
}

UnansweredQuestionRandomController.$inject = ['$location', 'Question'];
angular.module('app').controller('UnansweredQuestionRandomController', UnansweredQuestionRandomController);
