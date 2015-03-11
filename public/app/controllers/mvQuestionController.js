angular.module('app').controller('mvQuestionController', function ($scope, $routeParams, mvQuestionService, $location) {
  mvQuestionService.getQuestionById($routeParams.id).then(function (question) {
    $scope.question = question;
  }, function (reason) {
    mvNotifier.error(reason);
    $location.path('/');
  });
});