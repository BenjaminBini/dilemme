function mvQuestionDetailController($scope, $routeParams, $location, mvNotifier, mvQuestionService, mvDialog) {
  var question = {};
  question.answers = [];
  $scope.question = question;
  $scope.isLoaded = false;
  $scope.editionMode = false;

  if ($routeParams.id !== 'add') {
    mvQuestionService.getQuestionById($routeParams.id).then(function (questionResponse) {
      question = questionResponse;
      $scope.question = question;
      $scope.isLoaded = true;
      $scope.editionMode = true;
    }, function (reason) {
      mvNotifier.error(reason);
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
      mvQuestionService.updateQuestion(question).then(function () {
        mvNotifier.notify('QUESTION_UPDATED_SUCCESS');
        $location.path('/admin/questions');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    } else {
      mvQuestionService.createQuestion(question).then(function () {
        mvNotifier.notify('QUESTION_CREATED_SUCCESS');
        $location.path('/admin/questions');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }
  };

  $scope.delete = function () {
    $scope.itemType = 'QUESTION';
    mvDialog.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        mvQuestionService.deleteQuestion(question).then(function () {
          mvNotifier.notify('QUESTION_REMOVED_SUCCESS');
          $location.path('/admin/questions');
        }, function (reason) {
          mvNotifier.error(reason);
        });
      }
    });
  };
}

mvQuestionDetailController.$inject = ['$scope', '$routeParams', '$location', 'mvNotifier', 'mvQuestionService', 'mvDialog'];
angular.module('app').controller('mvQuestionDetailController', mvQuestionDetailController);