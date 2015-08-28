function ModalService(ngDialog) {
  return {
    confirmDelete: function(scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/ui/confirm-delete'
      }).closePromise;
    },
    login: function(scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/users/login-modal',
        controller: 'LoginController'
      }).closePromise;
    },
    register: function(scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/users/register-modal',
        controller: 'RegisterController'
      }).closePromise;
    },
    suggestQuestion: function(scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/questions/suggestions/suggest-question-modal',
        controller: 'SuggestQuestionController',
        className: 'ngdialog-theme-default ngdialog-large'
      }).closePromise;
    },
    example: function(scope) {
      ngDialog.open({
        scope: scope,
        template: '/partials/ui/example-modal'
      });
    }
  };
}

ModalService.$inject = ['ngDialog'];
angular.module('app').factory('ModalService', ModalService);
