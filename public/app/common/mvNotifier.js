angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('mvNotifier', function(mvToastr) {
	toastr.options.progressBar = true; 
	return {
		notify: function (msg) {
			toastr.clear();
			mvToastr.success(msg);
			console.log(msg);
		},
		warn: function (msg) {
			toastr.clear();
			mvToastr.warning(msg);
			console.log(msg);
		},
		error: function (msg) {
			toastr.clear();
			mvToastr.error(msg);
			console.log(msg);
		}
	};
});