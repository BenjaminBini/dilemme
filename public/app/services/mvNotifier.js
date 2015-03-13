angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('mvNotifier', function (mvToastr, $log) {
  toastr.options.progressBar = true; 
  return {
    notify: function (msg) {
      toastr.clear();
      mvToastr.success(msg);
      $log.log(msg);
    },
    warn: function (msg) {
      toastr.clear();
      mvToastr.warning(msg);
      $log.error(msg);
    },
    error: function (msg) {
      toastr.clear();
      mvToastr.error(msg);
      $log.error(msg);
    }
  };
});