function mvMainController($scope, mvQuestion) {
  var question = mvQuestion.unansweredRandom(function () {
    $scope.question = question;
  });
}

mvMainController.$inject = ['$scope', 'mvQuestion'];
angular.module('app').controller('mvMainController', mvMainController);