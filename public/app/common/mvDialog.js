angular.module('app').factory('mvDialog', function(ngDialog) {
	return {
		confirmDelete: function (scope) {
			ngDialog.open({
				scope: scope,
				template: '/partials/common/modals/confirm-delete.jade'
			});
		},
		example: function (scope) {
			ngDialog.open({
				scope: scope,
				template: '/partials/common/modals/example.jade'
			});
		}
	};
});