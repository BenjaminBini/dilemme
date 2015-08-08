function mvUnansweredQuestionRandomController($location, mvQuestion) {
  // Redirect to random question page
  var question = mvQuestion.unansweredRandom(function () {
    $location.path('/questions/' + question._id);
  });
}

mvUnansweredQuestionRandomController.$inject = ['$location', 'mvQuestion'];
angular.module('app').controller('mvUnansweredQuestionRandomController', mvUnansweredQuestionRandomController);