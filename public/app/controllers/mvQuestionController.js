function mvQuestionController($scope, $routeParams, $location, mvQuestionService, mvNotifier) {
  mvQuestionService.getQuestionById($routeParams.id).then(function (question) {
    $scope.question = question;
  }, function (reason) {
    mvNotifier.error(reason);
    $location.path('/');
  });
}

mvQuestionController.$inject = ['$scope', '$routeParams', '$location', 'mvQuestionService', 'mvNotifier'];
angular.module('app').controller('mvQuestionController', mvQuestionController);