function mvNewController($scope, mvQuestionService) {

  mvQuestionService.getAll().then(function (questions) {
    $scope.questions = questions;
  });

}

mvNewController.$inject = ['$scope', 'mvQuestionService'];
angular.module('app').controller('mvNewController', mvNewController);