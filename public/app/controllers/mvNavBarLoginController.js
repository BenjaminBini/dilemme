angular.module('app').controller('mvNavBarLoginController', function($scope, $http, $location, mvNotifier, mvAuthService, mvDialog) {
	$scope.signin = function(username, password) {
		mvAuthService.authenticateUser(username, password).then(function(success) {
			if (success) {
				mvNotifier.notify('You have successfully signed in.');
			} else {
				mvNotifier.warn('Username/Password combination incorrect');
			}
		})
	};
	$scope.signout = function() {
		mvAuthService.logoutUser().then(function() {
			$scope.username = '';
			$scope.password = '';
			mvNotifier.notify('You have successfully signed out.');
			$location.path('/');
		});
	};
	$scope.openRegisterModal = function () {
		mvDialog.register();
	};
});