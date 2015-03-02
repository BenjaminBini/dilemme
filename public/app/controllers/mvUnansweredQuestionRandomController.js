angular.module('app').controller('mvUnansweredQuestionRandomController', function ($location, mvQuestion) {
  // Redirect to random question page
  var question = mvQuestion.unansweredRandom(function () {
    $location.path('/questions/' + question._id);
  });
});