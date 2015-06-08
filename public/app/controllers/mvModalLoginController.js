angular.module('app').controller('mvModalLoginController', function ($scope, mvNotifier, mvAuthService) {
  $scope.signin = function (email, password) {
    mvAuthService.authenticateUser(email, password).then(function (success) {
      if (success) {
        mvNotifier.notify('SIGN_IN_SUCCESS');
        $scope.closeThisDialog();
      } else {
        mvNotifier.warn('SIGN_IN_ERROR');
      }
    });
  };
});