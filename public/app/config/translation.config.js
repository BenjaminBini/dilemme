/**
 * Translation configuration
 */
function translationConfig($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locale/locale-',
    suffix: '.json'
  });

  $translateProvider.fallbackLanguage('en_US');

  $translateProvider.useSanitizeValueStrategy('escape');

}

translationConfig.$inject = ['$translateProvider'];
angular.module('app').config(translationConfig);
