function mvTopController($scope, mvQuestionService) {
  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });
}

mvTopController.$inject = ['$scope', 'mvQuestionService'];
angular.module('app').controller('mvTopController', mvTopController);