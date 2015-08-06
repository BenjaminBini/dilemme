/**
 * Routes configuration
 */
function routesConfig($routeProvider, $locationProvider) {
  /**
   * Roles configuration
   */
  var routeRolesCheck = {
    admin: {
      auth: ['mvAuthService', function (mvAuthService) {
        return mvAuthService.authorizeCurrentUserForRoute('admin');
      }]
    },
    user: {
      auth: ['mvAuthService', function (mvAuthService) {
        return mvAuthService.authorizeAuthenticatedUserForRoute();
      }]
    }
  };


  /**
   * Use HTML5 mode (no # in route)
   */
  $locationProvider.html5Mode(true);

  /**
   * Routes config
   */
  $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mvMainController',
      animation: 'view-transition'
    })
    .when('/questions/random', {
      template: '',
      controller: 'mvQuestionRandomController',
      animation: 'view-transition'
    })
    .when('/questions/random/unanswered', {
      template: '',
      controller: 'mvUnansweredQuestionRandomController',
      animation: 'view-transition'
    })
    .when('/questions/browse', {
      templateUrl: '/partials/questions/browse',
      controller: 'mvBrowseController',
      animation: 'view-transition'
    })
    .when('/questions/most-answered', {
      templateUrl: '/partials/questions/most-answered.jade',
      controller: 'mvMostAnsweredController',
      animation: 'view-transition'
    })
    .when('/questions/most-voted', {
      templateUrl: '/partials/questions/most-voted.jade',
      controller: 'mvMostVotedController',
      animation: 'view-transition'
    })
    .when('/questions/:id', {
      templateUrl: '/partials/questions/question.jade',
      controller: 'mvQuestionController',
      animation: 'view-transition'
    })
    .when('/questions/tag/:tag', {
      templateUrl: '/partials/questions/tag/tag.jade',
      controller: 'mvTagViewController',
      animation: 'view-transition'
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/users/user-list',
      controller: 'mvUserListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/users/:id', {
      templateUrl: '/partials/admin/users/user-detail',
      controller: 'mvUserDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/questions', {
      templateUrl: '/partials/admin/questions/question-list',
      controller: 'mvQuestionListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/questions/:id', {
      templateUrl: '/partials/admin/questions/question-detail',
      controller: 'mvQuestionDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/suggestions', {
      templateUrl: '/partials/admin/suggestions/suggestion-list',
      controller: 'mvSuggestionListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/suggestions/:id', {
      templateUrl: '/partials/admin/suggestions/suggestion-detail',
      controller: 'mvSuggestionDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/register', {
      templateUrl: '/partials/account/register',
      controller: 'mvRegisterController',
      animation: 'view-transition'
    })
    .when('/stats', {
      templateUrl: '/partials/account/stats',
      controller: 'mvStatsController',
      resolve: routeRolesCheck.user,
      animation: 'view-transition'
    })
    .when('/profile', {
      templateUrl: '/partials/account/profile',
      controller: 'mvProfileController',
      resolve: routeRolesCheck.user,
      animation: 'view-transition'
    });
}

routesConfig.$inject = ['$routeProvider', '$locationProvider'];
angular.module('app').config(routesConfig);