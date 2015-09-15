function TranslationService($translate, $rootScope, localStorageService) {
  return {
    useLanguage: function(language) {
      $translate.use(language);
      localStorageService.set('language', language);
      $rootScope.userLanguage = language;
    },
    getCurrentLanguage: function() {
      return $translate.use();
    }
  };
}

TranslationService.$inject = ['$translate', '$rootScope', 'localStorageService'];
angular.module('app').factory('TranslationService', TranslationService);
