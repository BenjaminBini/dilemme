function loadingSpinner($http) {
  return {
    restrict: 'E',
    templateUrl: '/directives-templates/loading-spinner/loading-spinner',
    link: function(scope, element) {
      scope.isLoading = function() {
        return $http.pendingRequests.length > 0;
      };
      var timer = 0;
      scope.$watch(scope.isLoading, function(isLoading) {
        if (isLoading) {
          timer = setTimeout(function() {
            element.show();
          }, 100);
        } else {
          clearTimeout(timer);
          timer = 0;
          element.hide();
        }
      });
    }
  };
}

loadingSpinner.$inject = ['$http'];
angular.module('app').directive('loadingSpinner', loadingSpinner);
