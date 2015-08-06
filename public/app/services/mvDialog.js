function mvDialog(ngDialog) {
  return {
    confirmDelete: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/confirm-delete.jade'
      }).closePromise;
    },
    login: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/login.jade',
        controller: 'mvModalLoginController'
      }).closePromise;
    },
    register: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/register.jade',
        controller: 'mvRegisterController'
      }).closePromise;
    },
    suggestQuestion: function (scope) {
      return ngDialog.open({
        scope: scope,
        template: '/partials/modals/suggest-question.jade',
        controller: 'mvSuggestQuestionController',
        className: 'ngdialog-theme-default ngdialog-large'
      }).closePromise;
    },
    example: function (scope) {
      ngDialog.open({
        scope: scope,
        template: '/partials/modals/example.jade'
      });
    }
  };
}

mvDialog.$inject = ['ngDialog'];
angular.module('app').factory('mvDialog', mvDialog);