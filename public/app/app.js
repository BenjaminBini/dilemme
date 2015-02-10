angular.module('app', ['ngResource', 'ngRoute', 'ui.select']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
	
	var routeRolesCheck = {
		admin: {
			auth: function (mvAuth) {
				return mvAuth.authorizeCurrentUserForRoute('admin');
			}
		},
		user: {
			auth: function (mvAuth) {
				return mvAuth.authorizeAuthenticatedUserForRoute();
			}
		}
	}

	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', { 
			templateUrl: '/partials/main/main',
			controller: 'mvMainController' 
		})
		.when('/admin/users', { 
			templateUrl: '/partials/admin/users/user-list', 
			controller: 'mvUserListController',
			resolve: routeRolesCheck.admin
		})
		.when('/admin/users/:id', { 
			templateUrl: '/partials/account/profile', 
			controller: 'mvUserDetailController',
			resolve: routeRolesCheck.admin
		})
		.when('/signup', {
			templateUrl: '/partials/account/signup',
			controller: 'mvUserSignupController'
		})
		.when('/profile', {
			templateUrl: '/partials/account/profile',
			controller: 'mvProfileController',
			resolve: routeRolesCheck.user
		})
		.when('/admin/questions', {
			templateUrl: '/partials/admin/questions/question-list',
			controller: 'mvQuestionListController',
			resolve: routeRolesCheck.admin
		})
		.when('/admin/questions/:id', {
			templateUrl: '/partials/admin/questions/question-detail',
			controller: 'mvQuestionDetailController',
			resolve: routeRolesCheck.admin
		});
});

angular.module('app').run(function ($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
		if (rejection === 'not authorized') {
			$location.path('/');
		}
	});
});
