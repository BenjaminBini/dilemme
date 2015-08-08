/**
 * Translation configuration
 */
function translationConfig($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locale/locale-',
    suffix: '.json'
  });

  $translateProvider.useSanitizeValueStrategy('escape');

  $translateProvider.determinePreferredLanguage();
}

translationConfig.$inject = ['$translateProvider'];
angular.module('app').config(translationConfig);