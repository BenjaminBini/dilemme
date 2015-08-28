function NavbarController($scope, $location, NotifierService, AuthService, ModalService) {
  $scope.signin = function(email, password) {
    AuthService.authenticateUser(email, password).then(function(success) {
      if (success) {
        NotifierService.notify('SIGN_IN_SUCCESS');
      } else {
        NotifierService.warn('SIGN_IN_ERROR');
      }
    });
  };
  $scope.signout = function() {
    AuthService.logoutUser().then(function() {
      $scope.email = '';
      $scope.password = '';
      NotifierService.notify('SIGN_OUT_SUCCESS');
      $location.path('/');
    });
  };
  $scope.openRegisterModal = function() {
    ModalService.register();
  };
  $scope.openSuggestModal = function() {
    ModalService.suggestQuestion();
  };
}

NavbarController.$inject = ['$scope', '$location', 'NotifierService', 'AuthService', 'ModalService'];
angular.module('app').controller('NavbarController', NavbarController);
