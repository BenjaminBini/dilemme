function LanguageSwitcherController($scope, TranslationService) {

  $scope.currentLanguage = TranslationService.getCurrentLanguage();

  $scope.setLanguage = function(language) {
    $scope.currentLanguage = language;
    TranslationService.useLanguage(language);
  };
}

LanguageSwitcherController.$inject = ['$scope', 'TranslationService'];
angular.module('app').controller('LanguageSwitcherController', LanguageSwitcherController);
