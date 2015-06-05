angular.module('app', ['ngResource', 'ngRoute', 'ui.select',
                      'ui.odometer', 'ngDialog', 'ngAnimate',
                      'LocalStorageModule', 'chart.js',
                      'angularUtils.directives.dirPagination',
                      'pascalprecht.translate', 'cfp.hotkeys']);

angular.module('app').run(function ($route, $rootScope, $location, mvIdentity, $translate, $window) {
  // Redirect to homepage if not authorized
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/');
    }
  });

  // Set title
  $translate('SITE_NAME').then(function (siteName) {
    $window.document.title = siteName;
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