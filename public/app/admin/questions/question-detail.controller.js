function QuestionDetailController($scope, $routeParams, $location, NotifierService, QuestionService, ModalService) {
  var question = {};
  question.answers = [];
  $scope.question = question;
  $scope.isLoaded = false;
  $scope.editionMode = false;

  if ($routeParams.id !== 'add') {
    QuestionService.getQuestionById($routeParams.id).then(function (questionResponse) {
      question = questionResponse;
      $scope.question = question;
      $scope.isLoaded = true;
      $scope.editionMode = true;
    }, function (reason) {
      NotifierService.error(reason);
    });
  } else {
    $scope.isLoaded = true;
  }

  $scope.save = function () {
    var i;
    var tags = [];
    if (question.tags !== undefined) {
      if (!Array.isArray(question.tags)) {
        question.tags = question.tags.split(',');
      }
      for (i = 0; i < question.tags.length; i++) {
        if (question.tags[i].length > 0) {
          tags.push($.trim(question.tags[i]));
        }
      }
    }
    question.tags = tags;
    if (question._id) {
      QuestionService.updateQuestion(question).then(function () {
        NotifierService.notify('QUESTION_UPDATED_SUCCESS');
        $location.path('/admin/questions');
      }, function (reason) {
        NotifierService.error(reason);
      });
    } else {
      QuestionService.createQuestion(question).then(function () {
        NotifierService.notify('QUESTION_CREATED_SUCCESS');
        $location.path('/admin/questions');
      }, function (reason) {
        NotifierService.error(reason);
      });
    }
  };

  $scope.delete = function () {
    $scope.itemType = 'QUESTION';
    ModalService.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        QuestionService.deleteQuestion(question).then(function () {
          NotifierService.notify('QUESTION_REMOVED_SUCCESS');
          $location.path('/admin/questions');
        }, function (reason) {
          NotifierService.error(reason);
        });
      }
    });
  };
}

QuestionDetailController.$inject = ['$scope', '$routeParams', '$location', 'NotifierService', 'QuestionService', 'ModalService'];
angular.module('app').controller('QuestionDetailController', QuestionDetailController);