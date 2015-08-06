function mvLanguageSwitcherController($scope, $translate, localStorageService) {
  var savedLanguage = localStorageService.get('language');
  if (!!savedLanguage) {
    $translate.use(savedLanguage);
    $scope.currentLanguage = savedLanguage;
  } else {
    $scope.currentLanguage = $translate.use();
  }

  $scope.setLanguage = function (language) {
    $translate.use(language);
    $scope.currentLanguage = language;
    localStorageService.set('language', language);
  };
}

mvLanguageSwitcherController.$inject = ['$scope', '$translate', 'localStorageService'];
angular.module('app').controller('mvLanguageSwitcherController', mvLanguageSwitcherController);