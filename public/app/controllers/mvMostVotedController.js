angular.module('app').controller('mvMostVotedController', function ($scope, mvQuestionService) {

  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

});