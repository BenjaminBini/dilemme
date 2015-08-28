/**
 * Routes configuration
 */
function routesConfig($routeProvider, $locationProvider) {
  /**
   * Roles configuration
   */
  var routeRolesCheck = {
    admin: {
      auth: ['AuthService', function(AuthService) {
        return AuthService.authorizeCurrentUserForRoute('admin');
      }]
    },
    user: {
      auth: ['AuthService', function(AuthService) {
        return AuthService.authorizeAuthenticatedUserForRoute();
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
      templateUrl: '/partials/ui/home',
      controller: 'MainController',
      animation: 'view-transition'
    })
    .when('/questions/random', {
      template: '',
      controller: 'QuestionRandomController',
      animation: 'view-transition'
    })
    .when('/questions/random/unanswered', {
      template: '',
      controller: 'UnansweredQuestionRandomController',
      animation: 'view-transition'
    })
    .when('/questions/browse', {
      templateUrl: '/partials/questions/browse/browse-questions',
      controller: 'BrowseController',
      animation: 'view-transition'
    })
    .when('/questions/top', {
      templateUrl: '/partials/questions/top/top-questions',
      controller: 'TopController',
      animation: 'view-transition'
    })
    .when('/questions/new', {
      templateUrl: '/partials/questions/new/new-questions',
      controller: 'NewController',
      animation: 'view-transition'
    })
    .when('/questions/:id', {
      templateUrl: '/partials/questions/question',
      controller: 'QuestionController',
      animation: 'view-transition'
    })
    .when('/questions/tag/:tag', {
      templateUrl: '/partials/questions/tag/tag',
      controller: 'TagViewController',
      animation: 'view-transition'
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/users/user-list',
      controller: 'UserListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/users/:id', {
      templateUrl: '/partials/admin/users/user-detail',
      controller: 'UserDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/questions', {
      templateUrl: '/partials/admin/questions/question-list',
      controller: 'QuestionListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/questions/:id', {
      templateUrl: '/partials/admin/questions/question-detail',
      controller: 'QuestionDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/suggestions', {
      templateUrl: '/partials/admin/suggestions/suggestion-list',
      controller: 'SuggestionListController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/admin/suggestions/:id', {
      templateUrl: '/partials/admin/suggestions/suggestion-detail',
      controller: 'SuggestionDetailController',
      resolve: routeRolesCheck.admin,
      animation: 'view-transition'
    })
    .when('/register', {
      templateUrl: '/partials/users/register',
      controller: 'RegisterController',
      animation: 'view-transition'
    })
    .when('/stats', {
      templateUrl: '/partials/users/stats',
      controller: 'StatsController',
      resolve: routeRolesCheck.user,
      animation: 'view-transition'
    })
    .when('/profile', {
      templateUrl: '/partials/users/profile',
      controller: 'ProfileController',
      resolve: routeRolesCheck.user,
      animation: 'view-transition'
    });
}

routesConfig.$inject = ['$routeProvider', '$locationProvider'];
angular.module('app').config(routesConfig);
