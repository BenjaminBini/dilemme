angular.module('app').config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locale/locale-',
    suffix: '.json'
  });

  $translateProvider.useSanitizeValueStrategy('escape');

  $translateProvider.determinePreferredLanguage();
});