angular.module('app').controller('mvUserDetailController', function($scope, $routeParams, mvUser, mvNotifier, $location) {

	// Pass the edited user to the scope
	var user = mvUser.get({_id: $routeParams.id}, function() {
		$scope.email = user.username;
		$scope.fname = user.firstName;
		$scope.lname = user.lastName;
	});

	// Update the user
	$scope.update = function() {
		user.username = $scope.email;
		user.firstName = $scope.fname;
		user.lastName = $scope.lname;
		if ($scope.password && $scope.password.length > 0) {
			user.password = $scope.password;
		}
		user.$update().then(function () {
			mvNotifier.notify('User has been updated');
			$location.path('/admin/users');
		}, function (response) {
			mvNotifier.error(response.data.reason);
		});
	};

});