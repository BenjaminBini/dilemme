angular.module('app').directive('loadingSpinner' ,function ($http) {
	return {
		restrict: 'E',
		templateUrl: '/directives-templates/loading-spinner/loading-spinner.jade',
		link: function (scope, element, attrs) {
			scope.isLoading = function () {
				return $http.pendingRequests.length > 0;
			};
			var timer = 0;
			scope.$watch(scope.isLoading, function (isLoading) {
				if (isLoading) {
					timer = setTimeout(function() {
						element.fadeIn();
					}, 300);
				} else {
					clearTimeout(timer);
					timer = 0;
					element.fadeOut();
				}
			});
		}
	};
});
