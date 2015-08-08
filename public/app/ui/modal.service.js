function mvDialog(ngDialog) {
  return {
    confirmDelete: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/confirm-delete'
      }).closePromise;
    },
    login: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/users/login-modal',
        controller: 'mvModalLoginController'
      }).closePromise;
    },
    register: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/users/register-modal',
        controller: 'mvRegisterController'
      }).closePromise;
    },
    suggestQuestion: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/questions/suggestions/suggest-question-modal',
        controller: 'mvSuggestQuestionController',
        className: 'ngdialog-theme-default ngdialog-large'
      }).closePromise;
    },
    example: function (scope) {
      ngDialog.open({
        scope: scope,
        template: '/partials/ui/example-modal'
      });
    }
  };
}

mvDialog.$inject = ['ngDialog'];
angular.module('app').factory('mvDialog', mvDialog);