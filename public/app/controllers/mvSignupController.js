angular.module('app').controller('mvUserSignupController', function($scope, mvUser, mvNotifier, mvAuthService, $location) {
	
	$scope.signup = function() {
		var newUserData = {
			username: $scope.email,
			password: $scope.password,
			firstName: $scope.fname,
			lastName: $scope.lname,
		}
		
		mvAuthService.registerUser(newUserData).then(function () {
			mvNotifier.notify('User account created');
			$location.path('/');
		}, function (reason) {
			mvNotifier.error(reason);
		});
	};

});