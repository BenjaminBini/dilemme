function mvQuestionRandomController($location, mvQuestion) {
  // Redirect to random question page
  var question = mvQuestion.random(function () {
    $location.path('/questions/' + question._id);
  });
}

mvQuestionRandomController.$inject = ['$location', 'mvQuestion'];
angular.module('app').controller('mvQuestionRandomController', mvQuestionRandomController);