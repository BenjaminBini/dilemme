// Odometer configuration
angular.module('ui.odometer').config(['odometerOptionsProvider', function (odometerOptionsProvider) {
  odometerOptionsProvider.defaults = {
    duration : 5000,
    theme    : 'minimal'
  };
}]);