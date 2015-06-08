angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('mvNotifier', function (mvToastr, $log, $translate) {
  toastr.options.progressBar = true;
  return {
    notify: function (message) {
      toastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.success(translatedMessage);
      });
      $log.log(message);
    },
    warn: function (message) {
      toastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.warning(translatedMessage);
      });
      $log.error(message);
    },
    error: function (message) {
      toastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.error(translatedMessage);
      });
      $log.error(message);
    }
  };
});