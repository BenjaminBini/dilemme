/**
 * HTTP module configuration
 */
function httpConfig($httpProvider) {
  // Set an http interceptor to add custom user language header
  $httpProvider.interceptors.push('httpRequestInterceptor');
}

httpConfig.$inject = ['$httpProvider'];
angular.module('app').config(httpConfig);
