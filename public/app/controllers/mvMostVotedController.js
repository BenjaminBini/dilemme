function mvMostVotedController($scope, mvQuestionService) {

  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

}

mvMostVotedController.$inject = ['$scope', 'mvQuestionService'];
angular.module('app').controller('mvMostVotedController', mvMostVotedController);