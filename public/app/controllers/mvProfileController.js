angular.module('app').controller('mvProfileController', function ($scope, mvAuthService, mvIdentity, mvNotifier) {
  $scope.username = mvIdentity.currentUser.username;
  $scope.email = mvIdentity.currentUser.email;

  $scope.update = function () {
    var newUserData = {
      username: $scope.username,
      email: $scope.email,
    };
    if ($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }
    mvAuthService.updateCurrentUser(newUserData).then(function () {
      mvNotifier.notify('Your profile has been updated');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

});