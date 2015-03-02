angular.module('app').controller('mvMainController', function ($scope, mvQuestion) {
  var question = mvQuestion.unansweredRandom(function () {
    $scope.question = question;
  });
});