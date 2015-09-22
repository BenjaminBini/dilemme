function ForgotPasswordController() {
  var vm = this;

  vm.requestPasswordChange = requestPasswordChange;

  function requestPasswordChange(usernameOrPassword) {
    window.alert(usernameOrPassword);
  }
}

ForgotPasswordController.$inject = [];
angular.module('app').controller('ForgotPasswordController', ForgotPasswordController);
