/*global toastr*/
angular.module('app').value('Toastr', toastr);

function NotifierService(Toastr, $log, $translate) {
  Toastr.options.progressBar = true;
  return {
    notify: function (message) {
      Toastr.clear();
      $translate(message).then(function (translatedMessage) {
        Toastr.success(translatedMessage);
      });
      $log.log(message);
    },
    warn: function (message) {
      Toastr.clear();
      $translate(message).then(function (translatedMessage) {
        Toastr.warning(translatedMessage);
      });
      $log.error(message);
    },
    error: function (message) {
      Toastr.clear();
      $translate(message).then(function (translatedMessage) {
        Toastr.error(translatedMessage);
      });
      $log.error(message);
    }
  };
}

NotifierService.$inject = ['Toastr', '$log', '$translate'];
angular.module('app').factory('NotifierService', NotifierService);