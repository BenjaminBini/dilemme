function QuestionRandomController($location, Question) {
  // Redirect to random question page
  var question = Question.random(function () {
    $location.path('/questions/' + question._id);
  });
}

QuestionRandomController.$inject = ['$location', 'Question'];
angular.module('app').controller('QuestionRandomController', QuestionRandomController);