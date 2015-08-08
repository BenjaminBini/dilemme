function mvModalLoginController($scope, mvNotifier, mvAuthService) {
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
}

mvModalLoginController.$inject = ['$scope', 'mvNotifier', 'mvAuthService'];
angular.module('app').controller('mvModalLoginController', mvModalLoginController);