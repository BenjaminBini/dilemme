/**
* Local storage config
*/
angular.module('app').config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('dilemme');
});