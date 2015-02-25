angular.module('app').factory('mvAuthService', function($http, mvIdentity, $q, mvUser, mvUserService) {
	return {
		authenticateUser: function(email, password) {
			var dfd = $q.defer();
			$http.post('/login', {email: email, password: password}).then(function (response) {
				if (response.data.success) {
					var user = new mvUser();
					angular.extend(user, response.data.user);
					mvIdentity.currentUser = user;
					dfd.resolve(true);
				} else {
					dfd.resolve(false);
				}
			});
			return dfd.promise;
		},
		registerUser: function (newUserData) {
			var newUser = new mvUser(newUserData);
			var dfd = $q.defer();

			mvUserService.createUser(newUser).then(function (user) {
				mvIdentity.currentUser = user;
				dfd.resolve();
			}, function (reason) {
				dfd.reject(reason);
			});

			return dfd.promise;
		},
		updateCurrentUser: function (newUserData) {
			var dfd = $q.defer();
			var clone = angular.copy(mvIdentity.currentUser);
			angular.extend(clone, newUserData);
			mvUserService.updateUser(clone).then(function () {
				mvIdentity.currentUser = clone;
				dfd.resolve();
			}, function (reason) {
				dfd.reject(reason);
			});
			return dfd.promise;
		},
		logoutUser: function() {
			var dfd = $q.defer();
			$http.post('/logout', {logout: true}).then(function() {
				mvIdentity.currentUser = undefined;
				dfd.resolve();
			});
			return dfd.promise;
		},
		authorizeCurrentUserForRoute: function (role) {
			if (mvIdentity.isAuthorized('admin')) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		},
		authorizeAuthenticatedUserForRoute: function () {
			if (mvIdentity.isAuthenticated()) {
				return true;
			} else {
				return $q.reject('not authorized');
			}
		}
	}
});