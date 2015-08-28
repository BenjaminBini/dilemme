function QuestionDetailController($scope, $routeParams, $location, NotifierService, QuestionService, ModalService, UserService) {
  var originalQuestion = {};
  var question = {};
  question.answers = [];
  $scope.question = question;
  $scope.isLoaded = false;

  if ($routeParams.id !== 'add') {
    QuestionService.getQuestionById($routeParams.id).then(function(questionResponse) {
      question = questionResponse;
      originalQuestion = question;
      $scope.question = question;
      $scope.isLoaded = true;

      UserService.getByAnsweredQuestion(question).then(function(users) {
        $scope.users = users;
      });

    }, function(reason) {
      NotifierService.error(reason);
    });
  } else {
    $scope.isLoaded = true;
  }

  $scope.save = function() {
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
      QuestionService.updateQuestion(question).then(function(newQuestion) {
        $scope.question = question = newQuestion;
        NotifierService.notify('QUESTION_UPDATED_SUCCESS');
      }, function(reason) {
        NotifierService.error(reason);
      });
    } else {
      QuestionService.createQuestion(question).then(function(newQuestion) {
        $scope.question = question = newQuestion;
        NotifierService.notify('QUESTION_CREATED_SUCCESS');
      }, function(reason) {
        NotifierService.error(reason);
      });
    }
  };

  $scope.delete = function() {
    $scope.itemType = 'QUESTION';
    ModalService.confirmDelete($scope).then(function(data) {
      if (data.value === 'confirm') {
        QuestionService.deleteQuestion(question).then(function() {
          NotifierService.notify('QUESTION_REMOVED_SUCCESS');
          $location.path('/admin/questions');
        }, function(reason) {
          NotifierService.error(reason);
        });
      }
    });
  };

  $scope.publish = function() {
    QuestionService.publishQuestion(originalQuestion).then(function(newQuestion) {
      $scope.question = question = newQuestion;
      NotifierService.notify('QUESTION_PUBLISHED_SUCCESS');
    });
  };

  $scope.unpublish = function() {
    QuestionService.unpublishQuestion(originalQuestion).then(function(newQuestion) {
      $scope.question = question = newQuestion;
      NotifierService.notify('QUESTION_UNPUBLISHED_SUCCESS');
    });
  };
}

QuestionDetailController.$inject = ['$scope', '$routeParams', '$location', 'NotifierService', 'QuestionService', 'ModalService', 'UserService'];
angular.module('app').controller('QuestionDetailController', QuestionDetailController);
