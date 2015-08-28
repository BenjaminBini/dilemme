function LoginController($scope, NotifierService, AuthService) {
  $scope.signin = function(email, password) {
    AuthService.authenticateUser(email, password).then(function(success) {
      if (success) {
        NotifierService.notify('SIGN_IN_SUCCESS');
        $scope.closeThisDialog();
      } else {
        NotifierService.warn('SIGN_IN_ERROR');
      }
    });
  };
}

LoginController.$inject = ['$scope', 'NotifierService', 'AuthService'];
angular.module('app').controller('LoginController', LoginController);
