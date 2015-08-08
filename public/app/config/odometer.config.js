/**
 * Odometer configuration
 */
function odometerConfiguration(odometerOptionsProvider) {
  odometerOptionsProvider.defaults = {
    duration : 5000,
    theme    : 'minimal'
  };
}

odometerConfiguration.$inject = ['odometerOptionsProvider'];
angular.module('ui.odometer').config(odometerConfiguration);