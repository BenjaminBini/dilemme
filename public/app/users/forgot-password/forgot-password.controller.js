function ForgotPasswordController(UserService, NotifierService, IdentityService) {
  var vm = this;

  vm.requestPasswordChange = requestPasswordChange;

  vm.mailSent = false;

  function requestPasswordChange(usernameOrPassword) {
    UserService.requestNewPassword(usernameOrPassword, IdentityService.shortLanguage).then(function(response) {
      if (response.newPasswordSent) {
        vm.mailSent = true;
      } else {
        NotifierService.warn('Cet utilisateur n\'existe pas');
      }
    });
  }
}

ForgotPasswordController.$inject = ['UserService', 'NotifierService', 'IdentityService'];
angular.module('app').controller('ForgotPasswordController', ForgotPasswordController);
