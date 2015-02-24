angular.module('app').controller('mvModalLoginController', function($scope, mvNotifier, mvAuthService) {
	$scope.signin = function(username, password) {
		mvAuthService.authenticateUser(username, password).then(function(success) {
			if (success) {
				mvNotifier.notify('You have successfully signed in.');
				$scope.closeThisDialog();
			} else {
				mvNotifier.warn('Username/Password combination incorrect');
			}
		})
	};
});