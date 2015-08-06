function mvMostAnsweredController($scope, mvQuestionService) {
  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });
}

mvMostAnsweredController.$inject = ['$scope', 'mvQuestionService'];
angular.module('app').controller('mvMostAnsweredController', mvMostAnsweredController);