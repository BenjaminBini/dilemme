function QuestionController($scope, $routeParams, $location, QuestionService, NotifierService) {
  QuestionService.getQuestionById($routeParams.id).then(function (question) {
    $scope.question = question;
  }, function (reason) {
    NotifierService.error(reason);
    $location.path('/');
  });
}

QuestionController.$inject = ['$scope', '$routeParams', '$location', 'QuestionService', 'NotifierService'];
angular.module('app').controller('QuestionController', QuestionController);