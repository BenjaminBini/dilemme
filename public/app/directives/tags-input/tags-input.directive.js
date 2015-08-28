angular.module('app').directive('tagsInput', function() {
  return {
    restrict: 'E',
    templateUrl: '/directives-templates/tags-input/tags-input',
    scope: {
      tags: '=?',
      primary: '=?',
      isLoaded: '=?'
    },
    link: function link(scope, element, attrs) {
      scope.$watch(attrs.isLoaded, function(isLoaded) {
        if (isLoaded) {
          $('input', element).tagsinput();
        }
      });
    }
  };
});
