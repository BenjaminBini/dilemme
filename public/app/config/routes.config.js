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
      controller: 'MainController'
    })
    .when('/questions/random', {
      template: '',
      controller: 'QuestionRandomController'
    })
    .when('/questions/random/unanswered', {
      template: '',
      controller: 'UnansweredQuestionRandomController'
    })
    .when('/questions/browse', {
      templateUrl: '/partials/questions/browse/browse-questions',
      controller: 'BrowseController'
    })
    .when('/questions/top', {
      templateUrl: '/partials/questions/top/top-questions',
      controller: 'TopController'
    })
    .when('/questions/new', {
      templateUrl: '/partials/questions/new/new-questions',
      controller: 'NewController'
    })
    .when('/questions/:id', {
      templateUrl: '/partials/questions/question',
      controller: 'QuestionController'
    })
    .when('/questions/tag/:tag', {
      templateUrl: '/partials/questions/tag/tag',
      controller: 'TagViewController'
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/users/user-list',
      controller: 'UserListController',
      resolve: routeRolesCheck.admin
    })
    .when('/admin/users/:id', {
      templateUrl: '/partials/admin/users/user-detail',
      controller: 'UserDetailController',
      resolve: routeRolesCheck.admin
    })
    .when('/admin/questions', {
      templateUrl: '/partials/admin/questions/question-list',
      controller: 'QuestionListController',
      resolve: routeRolesCheck.admin
    })
    .when('/admin/questions/:id', {
      templateUrl: '/partials/admin/questions/question-detail',
      controller: 'QuestionDetailController',
      resolve: routeRolesCheck.admin
    })
    .when('/admin/suggestions', {
      templateUrl: '/partials/admin/suggestions/suggestion-list',
      controller: 'SuggestionListController',
      resolve: routeRolesCheck.admin
    })
    .when('/admin/suggestions/:id', {
      templateUrl: '/partials/admin/suggestions/suggestion-detail',
      controller: 'SuggestionDetailController',
      resolve: routeRolesCheck.admin
    })
    .when('/register', {
      templateUrl: '/partials/users/register',
      controller: 'RegisterController'
    })
    .when('/forgot-password', {
      templateUrl: '/partials/users/forgot-password/forgot-password',
      controller: 'ForgotPasswordController',
      controllerAs: 'vm',
    })
    .when('/forgot-password/reset/:token', {
      templateUrl: '/partials/users/forgot-password/reset-password',
      controller: 'PasswordResetController',
      controllerAs: 'vm'
    })
    .when('/stats', {
      templateUrl: '/partials/users/stats',
      controller: 'StatsController',
      resolve: routeRolesCheck.user
    })
    .when('/profile', {
      templateUrl: '/partials/users/profile',
      controller: 'ProfileController',
      resolve: routeRolesCheck.user
    })
    .otherwise({
      redirectTo: '/'
    });
}

routesConfig.$inject = ['$routeProvider', '$locationProvider'];
angular.module('app').config(routesConfig);
