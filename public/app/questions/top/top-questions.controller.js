function TopController($scope, QuestionService) {
  QuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });
}

TopController.$inject = ['$scope', 'QuestionService'];
angular.module('app').controller('TopController', TopController);