angular.module('app').controller('mvAnswerController', function ($scope, mvQuestionService, $location, mvNotifier, mvIdentity, localStorageService, mvDialog, $window, hotkeys) {

  /**
   * Answer the question
   * @param  {Number} answer Answer of the question (0 or 1)
   */
  $scope.answer = function (answer) {
    if (!$scope.answered) {
      $scope.results = mvQuestionService.getProportions($scope.question);
      mvQuestionService.answerQuestion($scope.question, answer).then(function () {
        $scope.results = mvQuestionService.getProportions($scope.question);
        // Push the answer to current user answer list if authenticated
        if (mvIdentity.isAuthenticated()) {
          mvIdentity.currentUser.answers.push({
            question: $scope.question,
            answer: answer
          });
        } else { // Push it in the local storage/cookie
          mvQuestionService.saveAnswerLocally($scope.question, answer);
        }
      }, function (reason) {
        mvNotifier.error(reason);
      });
    }
  };

  /**
   * Upvote the question
   */
  $scope.upvote = function () {
    mvQuestionService.upvoteQuestion($scope.question).then(function () {
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  /**
   * Add a comment to the question
   * @param  {String} comment The comment to add
   */
  $scope.comment = function (comment) {
    mvQuestionService.commentQuestion($scope.question, comment).then(function (question) {
      mvNotifier.notify('Your comment has been successfully posted');
      $scope.question = question;
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  /**
   * Delete a comment
   * @param  {String} commentId Id of the comment to delete
   */
  $scope.deleteComment = function (commentId) {
    $scope.itemType = 'COMMENT';
    mvDialog.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        mvQuestionService.deleteComment($scope.question, commentId).then(function () {
          mvNotifier.notify('The comment has been removed');
        }, function (reason) {
          mvNotifier.error(reason);
        });
      }
    });
  };

  /**
   * Upvote a comment
   * @param  {String} commentId Id of the comment to delete
   */
  $scope.upvoteComment = function (commentId) {
    mvQuestionService.upvoteComment($scope.question, commentId).then(function () {
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  /**
   * Comment sort options
   * @type {Array}
   */
  $scope.sortOptions = [{
    value: "date",
    text: "Sort by date"
  }, {
    value: "upvotes",
    text: "Sort by upvotes"
  }];

  /**
   * Selected sort order
   * @type {Object}
   */
  $scope.sortOrder = {
    selected: $scope.sortOptions[0].value
  };

  /**
   * Go to next question
   */
  $scope.nextQuestion = function () {
    var question = mvQuestionService.getUnansweredQuestion().then(function (question) {
      $scope.question = question;
      $location.path('/questions/' + question._id, false);
    });
  };

  /**
   * Bind the nextQuestion function to a shortcut
   */
  hotkeys.bindTo($scope).add({
    combo: 'right',
    description: 'Go to next question',
    callback: $scope.nextQuestion
  });

  /**
   * Open the registration modal
   */
  $scope.openRegisterModal = function () {
    mvDialog.register();
  };

  /**
   * Open the login modal
   */
  $scope.openLoginModal = function () {
    mvDialog.login();
  };

  /**
   * Share the question on FB
   */
  $scope.facebookShare = function () {
    FB.ui({
      method: 'feed',
      name: 'Dilemme : ' + $scope.question.text + ' ' + $scope.question.answers[0].text + ' or ' + $scope.question.answers[1].text + ' ?',
      link: 'http://dilemme.io/questions/' + $scope.question._id,
      description: $scope.question.description
    });
  };

  /**
   * Share the question on Twitter
   */
  $scope.twitterShare = function () {
    var link = 'https://twitter.com/share?';
    link += 'url=http://dilemme.io/questions/' + $scope.question._id;
    link += '&text=Dilemme : ' + $scope.question.text + ' ' + $scope.question.answers[0].text + ' or ' + $scope.question.answers[1].text + ' ?';

    var width = 555;
    var height = 255;
    var left = $window.innerWidth / 2 - width / 2;
    var top = $window.innerHeight / 2 - height / 2;
    return $window.open(link, '', 'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  };

  /**
   * Check if the user has already answered the question
   * If yes, show the answer
   */
  $scope.$watch('question', function (question) {
    var i;
    if (!!question) {
      $scope.answered = false;
      $scope.userAnswer = -1;
      var answers;
      if (mvIdentity.isAuthenticated()) {
        answers = mvIdentity.currentUser.answers;
      } else {
        answers = localStorageService.get('answers');
      }
      if (answers) {
        for (i = 0; i < answers.length; i++) {
          if (answers[i].question._id == question._id) {
            $scope.userAnswer = answers[i].answer;
            $scope.results = mvQuestionService.getProportions($scope.question);
            $scope.answered = true;
            $scope.answer = function () {};
            break;
          }
        }
      }
    }
  });
});