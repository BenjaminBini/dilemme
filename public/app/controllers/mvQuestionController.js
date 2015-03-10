angular.module('app').controller('mvQuestionController', function ($scope, $routeParams, mvQuestion, $location) {
  var question = mvQuestion.get({_id: $routeParams.id}, function () {
    $scope.question = question;
  }, function () {
    $location.path('/');
  });
});