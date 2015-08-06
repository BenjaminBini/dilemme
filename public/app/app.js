angular.module('app', ['ngResource', 'ngRoute', 'ui.select',
                      'ui.odometer', 'ngDialog', 'ngAnimate',
                      'LocalStorageModule', 'chart.js',
                      'angularUtils.directives.dirPagination',
                      'pascalprecht.translate', 'cfp.hotkeys']);

function initConfig($route, $rootScope, $location, mvIdentity, $translate, $window) {
  // Redirect to homepage if not authorized
  /*jslint unparam: true*/
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/');
    }
  });
  /*jslint unparam: false*/

  // Set title
  $translate('SITE_NAME').then(function (siteName) {
    $window.document.title = siteName;
  });

  // Set identity in rootScope
  $rootScope.identity = mvIdentity;

  // Set animation in rootScope
  /*jslint unparam: true*/
  $rootScope.$on('$routeChangeStart', function (event, currentRoute) {
    $rootScope.animation = currentRoute.animation;
  });
  /*jslint unparam: false*/

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
}

initConfig.$inject = ['$route', '$rootScope', '$location', 'mvIdentity', '$translate', '$window'];
angular.module('app').run(initConfig);