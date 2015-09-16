function extractTranslation($rootScope) {
  return function(node) {
    if (!!node) {
      return node[$rootScope.identity.shortLanguage];
    } else {
      return;
    }
  };
}

extractTranslation.$inject = ['$rootScope'];
angular.module('app').filter('extractTranslation', extractTranslation);