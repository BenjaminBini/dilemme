function mvProfileController($scope, mvAuthService, mvSuggestionService, mvQuestionService, mvIdentity, mvNotifier) {
  $scope.username = mvIdentity.currentUser.username;
  $scope.email = mvIdentity.currentUser.email;
  $scope.currentUser = mvIdentity.currentUser;

  $scope.update = function () {
    var newUserData = {
      username: $scope.username,
      email: $scope.email,
    };
    if ($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }
    mvAuthService.updateCurrentUser(newUserData).then(function () {
      mvNotifier.notify('PROFILE_UPDATE_SUCCESS');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  mvSuggestionService.getSuggestionsByUser(mvIdentity.currentUser).then(function (suggestions) {
    $scope.suggestions = suggestions;
  });

  mvQuestionService.getQuestionsByAuthor(mvIdentity.currentUser).then(function (questions) {
    $scope.questions = questions;
  });
}

mvProfileController.$inject = ['$scope', 'mvAuthService', 'mvSuggestionService', 'mvQuestionService', 'mvIdentity', 'mvNotifier'];
angular.module('app').controller('mvProfileController', mvProfileController);