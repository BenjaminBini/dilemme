function UserDetailController($scope, $routeParams, User, NotifierService, $location, UserService, ModalService, SuggestionService, QuestionService) {

  // Pass the edited user to the scope
  var user = User.get({_id: $routeParams.id}, function() {
    $scope.userId = user._id;
    $scope.email = user.email;
    $scope.username = user.username;

    // Add user's suggestions to scope
    SuggestionService.getSuggestionsByUser(user).then(function(suggestions) {
      $scope.suggestions = suggestions;
    });

    // Add user's questions to scope
    QuestionService.getQuestionsByAuthor(user).then(function(questions) {
      $scope.questions = questions;
    });

    // Add user's answers to scope
    $scope.answers = user.answers;
  });

  // Update the user
  $scope.update = function() {
    user.username = $scope.username;
    user.email = $scope.email;
    if ($scope.password && $scope.password.length > 0) {
      user.password = $scope.password;
    }
    UserService.updateUser(user).then(function() {
      NotifierService.notify('USER_UPDATED_SUCCESS');
      $location.path('/admin/users');
    }, function(reason) {
      NotifierService.error(reason);
    });
  };

  // Delete the user
  $scope.delete = function() {
    $scope.itemType = 'USER';
    ModalService.confirmDelete($scope).then(function(data) {
      if (data.value === 'confirm') {
        UserService.deleteUser(user).then(function() {
          NotifierService.notify('USER_REMOVED_SUCCESS');
          $location.path('/admin/users');
        }, function(reason) {
          NotifierService.error(reason);
        });
      }
    });
  };
}

UserDetailController.$inject = ['$scope', '$routeParams', 'User', 'NotifierService', '$location', 'UserService', 'ModalService', 'SuggestionService', 'QuestionService'];
angular.module('app').controller('UserDetailController', UserDetailController);
