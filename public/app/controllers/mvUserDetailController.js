angular.module('app').controller('mvUserDetailController', function ($scope, $routeParams, mvUser, mvNotifier, $location, mvUserService, mvDialog) {

  // Pass the edited user to the scope
  var user = mvUser.get({_id: $routeParams.id}, function () {
    $scope.email = user.email;
    $scope.username = user.username;
  });

  // Update the user
  $scope.update = function () {
    user.username = $scope.username;
    user.email = $scope.email;
    if ($scope.password && $scope.password.length > 0) {
      user.password = $scope.password;
    }
    mvUserService.updateUser(user).then(function () {
      mvNotifier.notify('User has been updated');
      $location.path('/admin/users');
    }, function (reason) {
      mvNotifier.error(reason);
    });
  };

  // Delete the user
  $scope.delete = function () {
    $scope.itemType = 'user';
    mvDialog.confirmDelete($scope).then(function (data) {
      if (data.value === 'confirm') {
        mvUserService.deleteUser(user).then(function () {
          mvNotifier.notify('User deleted');
          $location.path('/admin/users');
        }, function (reason) {
          mvNotifier.error(reason);
        });
      }
    });
  };
});