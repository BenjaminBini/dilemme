function NewController($scope, QuestionService) {

  QuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

}

NewController.$inject = ['$scope', 'QuestionService'];
angular.module('app').controller('NewController', NewController);