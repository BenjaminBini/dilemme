/**
 * HTTP requests interceptor to add user language header
 */
function httpRequestInterceptor($rootScope) {
  return {
    request: function(config) {

      config.headers['user-language'] = $rootScope.userLanguage;

      return config;
    }
  };
}

httpRequestInterceptor.$inject = ['$rootScope'];
angular.module('app').factory('httpRequestInterceptor', httpRequestInterceptor);
