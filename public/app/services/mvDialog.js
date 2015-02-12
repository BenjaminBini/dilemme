angular.module('app').factory('mvDialog', function(ngDialog) {
	return {
		confirmDelete: function (scope) {
			return ngDialog.open({
				scope: scope,
				template: '/partials/modals/confirm-delete.jade'
			}).closePromise;
		},
		example: function (scope) {
			ngDialog.open({
				scope: scope,
				template: '/partials/modals/example.jade'
			});
		}
	};
});