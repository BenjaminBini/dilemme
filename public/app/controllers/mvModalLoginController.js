angular.module('app').controller('mvModalLoginController', function ($scope, mvNotifier, mvAuthService) {
  $scope.signin = function (email, password) {
    mvAuthService.authenticateUser(email, password).then(function (success) {
      if (success) {
        mvNotifier.notify('You have successfully signed in.');
        $scope.closeThisDialog();
      } else {
        mvNotifier.warn('Email/Password combination incorrect');
      }
    });
  };
});