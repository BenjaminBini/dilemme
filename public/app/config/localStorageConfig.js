/**
* Local storage config
*/
function localStorageConfig(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('dilemme');
}

localStorageConfig.$inject = ['localStorageServiceProvider'];
angular.module('app').config(localStorageConfig);