function MainController($scope, Question) {
  var question = Question.unansweredRandom(function() {
    $scope.question = question;
  });
}

MainController.$inject = ['$scope', 'Question'];
angular.module('app').controller('MainController', MainController);
