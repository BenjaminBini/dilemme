angular.module('app').controller('mvUserListController', function($scope, mvUser) {
	$scope.users = mvUser.query();

	$scope.sortOptions = [
	{
		value: "username + firstName + lastName",
		text: "Sort by text"
	}, {
		value: "registrationDate",
		text: "Sort by registration date"	
	}, {
		value: "role",
		text: "Sort by role"
	}]

	$scope.sortOrder = {
		selected: $scope.sortOptions[0].value
	}
});