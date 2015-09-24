function PasswordResetController($routeParams, $location, IdentityService, UserService, NotifierService) {
  var vm = this;

  vm.resetPassword = resetPassword;

  function resetPassword(newPassword) {
    UserService.resetPassword($routeParams.token, newPassword).then(function(user) {
      IdentityService.currentUser = user;
      NotifierService.notify('PASSWORD_RESET_SUCCESS');
      $location.path('/');
    }, function(reason) {
      NotifierService.error(reason);
    });
  }
}

PasswordResetController.$inject = ['$routeParams', '$location', 'IdentityService', 'UserService', 'NotifierService'];
angular.module('app').controller('PasswordResetController', PasswordResetController);
