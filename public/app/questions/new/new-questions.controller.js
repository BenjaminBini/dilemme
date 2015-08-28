function NewController($scope, QuestionService) {
  QuestionService.getPublished().then(function(questions) {
    $scope.questions = questions;
  });

}

NewController.$inject = ['$scope', 'QuestionService'];
angular.module('app').controller('NewController', NewController);
