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
        template: '/partials/modals/login',
        controller: 'mvModalLoginController'
      }).closePromise;
    },
    register: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/register',
        controller: 'mvRegisterController'
      }).closePromise;
    },
    suggestQuestion: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/suggest-question',
        controller: 'mvSuggestQuestionController',
        className: 'ngdialog-theme-default ngdialog-large'
      }).closePromise;
    },
    example: function (scope) {
      ngDialog.open({
        scope: scope,
        template: '/partials/modals/example'
      });
    }
  };
}

mvDialog.$inject = ['ngDialog'];
angular.module('app').factory('mvDialog', mvDialog);