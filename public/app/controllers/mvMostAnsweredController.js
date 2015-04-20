angular.module('app').controller('mvMostAnsweredController', function ($scope, mvQuestionService) {

  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

});