angular.module('app').controller('mvRegisterController', function($scope, mvNotifier, mvAuthService, $location) {
	
	$scope.registerFromPage = function() {
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

	$scope.registerFromModal = function() {
		var newUserData = {
			username: $scope.email,
			password: $scope.password,
			firstName: $scope.fname,
			lastName: $scope.lname,
		}
		mvAuthService.registerUser(newUserData).then(function () {
			mvNotifier.notify('You registered successfully');
			$scope.closeThisDialog();
		}, function (reason) {
			mvNotifier.error(reason);
		});
	}

});