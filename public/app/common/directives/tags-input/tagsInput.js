angular.module('app').directive('tagsInput', function () {
	return {
		restrict: 'E',
		templateUrl: '/partials/common/directives/tags-input/tags-input.jade',
		scope: {
			tags: '=?',
			primary: '=?',
			isLoaded: '=?'
		},
		link: function link(scope, element, attrs) {
            var loadedListener = scope.$watch(attrs.isLoaded, function (isLoaded) {
            	if (isLoaded) {
                	$('input', element).tagsinput();
                	loadedListener();
                }
            });
		}
	}
});