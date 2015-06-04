angular.module('app').config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locale/locale-',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('fr_FR');
});