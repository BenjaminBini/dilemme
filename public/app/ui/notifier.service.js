/*global toastr*/
angular.module('app').value('mvToastr', toastr);

function mvNotifier(mvToastr, $log, $translate) {
  mvToastr.options.progressBar = true;
  return {
    notify: function (message) {
      mvToastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.success(translatedMessage);
      });
      $log.log(message);
    },
    warn: function (message) {
      mvToastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.warning(translatedMessage);
      });
      $log.error(message);
    },
    error: function (message) {
      mvToastr.clear();
      $translate(message).then(function (translatedMessage) {
        mvToastr.error(translatedMessage);
      });
      $log.error(message);
    }
  };
}

mvNotifier.$inject = ['mvToastr', '$log', '$translate'];
angular.module('app').factory('mvNotifier', mvNotifier);