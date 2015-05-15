angular.module('app', ['ngResource', 'ngRoute', 'ui.select',
                      'ui.odometer', 'ngDialog', 'ngAnimate',
                      'LocalStorageModule', 'chart.js',
                      'angularUtils.directives.dirPagination', 'cfp.hotkeys']);

angular.module('app').config(function ($routeProvider, $locationProvider, localStorageServiceProvider, paginationTemplateProvider) {

  // Roles config
  var routeRolesCheck = {
    admin: {
      auth: function (mvAuthService) {
        return mvAuthService.authorizeCurrentUserForRoute('admin');
      }
    },
    user: {
      auth: function (mvAuthService) {
        return mvAuthService.authorizeAuthenticatedUserForRoute();
      }
    }
  };

  // Use HTML5 mode (no # in route)
  $locationProvider.html5Mode(true);

  // Routes config
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

  // Local storage config
  localStorageServiceProvider.setPrefix('dilemme');

  // Pagination template
  paginationTemplateProvider.setPath('/partials/templates/pagination');
});

angular.module('app').run(function ($route, $rootScope, $location, mvIdentity) {
  // Redirect to homepage if not authorized
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/');
    }
  });
  // Set identity in rootScope
  $rootScope.identity = mvIdentity;
  // Set animation in rootScope
  $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
    $rootScope.animation = currentRoute.animation;
  });

  // Custom $location.path method
  // Add a parameter that allows not to run controller on location change
  var original = $location.path;
  $location.path = function (path, reload) {
    if (reload === false) {
      var lastRoute = $route.current;
      var un = $rootScope.$on('$locationChangeSuccess', function () {
        $route.current = lastRoute;
        un();
      });
    }
    return original.apply($location, [path]);
  };
});


// Odometer configuration
angular.module('ui.odometer').config([
  'odometerOptionsProvider', function (odometerOptionsProvider) {
    odometerOptionsProvider.defaults = {
      duration : 5000,
      theme    : 'minimal'
    };
  }
]);