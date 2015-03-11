angular.module('app').controller('mvQuestionDetailController', function ($scope, $routeParams, mvNotifier, mvQuestionService, $location, mvDialog) {
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
    if (question.tags !== undefined && !Array.isArray(question.tags)) {
      question.tags = question.tags.split(',');
    }
    if (question.tags !== undefined) {
      for (i = 0; i < question.tags.length; i++) {
        question.tags[i] = $.trim(question.tags[i]);
      }
    }
    if (question._id) {
      mvQuestionService.updateQuestion(question).then(function () {
        mvNotifier.notify('Question has been updated');
        $location.path('/admin/questions');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    } else {
      mvQuestionService.createQuestion(question).then(function () {
        mvNotifier.notify('Question created');
        $location.path('/admin/questions');
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }
  };

  $scope.delete = function () {
    $scope.itemType = 'question';
    mvDialog.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        mvQuestionService.deleteQuestion(question).then(function () {
          mvNotifier.notify('Question deleted');
          $location.path('/admin/questions');
        }, function (reason) {
          mvNotifier.error(reason);
        });
      }
    });
  };

});