function ProfileController($scope, AuthService, SuggestionService, QuestionService, IdentityService, NotifierService) {
  $scope.username = IdentityService.currentUser.username;
  $scope.email = IdentityService.currentUser.email;
  $scope.currentUser = IdentityService.currentUser;

  $scope.update = function () {
    var newUserData = {
      username: $scope.username,
      email: $scope.email,
    };
    if ($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }
    AuthService.updateCurrentUser(newUserData).then(function () {
      NotifierService.notify('PROFILE_UPDATE_SUCCESS');
    }, function (reason) {
      NotifierService.error(reason);
    });
  };

  SuggestionService.getSuggestionsByUser(IdentityService.currentUser).then(function (suggestions) {
    $scope.suggestions = suggestions;
  });

  QuestionService.getQuestionsByAuthor(IdentityService.currentUser).then(function (questions) {
    $scope.questions = questions;
  });
}

ProfileController.$inject = ['$scope', 'AuthService', 'SuggestionService', 'QuestionService', 'IdentityService', 'NotifierService'];
angular.module('app').controller('ProfileController', ProfileController);