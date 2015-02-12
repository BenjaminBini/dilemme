angular.module('app', ['ngResource', 'ngRoute', 'ui.select', 'ngDialog']);

angular.module('app').config(function ($routeProvider, $locationProvider) {
	
	var routeRolesCheck = {
		admin: {
			auth: function (mvAuthService) {
				return mvAuthService.authorizeCurrentUserForRoute('admin');
			}
		},
		user: {
			auth: function (mvAuthService) {
				return mvAuthService.authorizeAuthenticatedUserForRoute();
			}
		}
	}

	$locationProvider.html5Mode(true);
	$routeProvider
		.when('/', { 
			templateUrl: '/partials/main/main',
			controller: 'mvMainController' 
		})
		.when('/questions/random', {
			template: '',
			controller: 'mvQuestionRandomController',
			resolve: routeRolesCheck.user
		})
		.when('/questions/:id', {
			templateUrl: '/partials/questions/question.jade',
			controller: 'mvQuestionController',
			resolve: routeRolesCheck.user
		})
		.when('/admin/users', { 
			templateUrl: '/partials/admin/users/user-list', 
			controller: 'mvUserListController',
			resolve: routeRolesCheck.admin
		})
		.when('/admin/users/:id', { 
			templateUrl: '/partials/admin/users/user-detail', 
			controller: 'mvUserDetailController',
			resolve: routeRolesCheck.admin
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
		})
		.when('/signup', {
			templateUrl: '/partials/account/signup',
			controller: 'mvUserSignupController'
		})
		.when('/profile', {
			templateUrl: '/partials/account/profile',
			controller: 'mvProfileController',
			resolve: routeRolesCheck.user
		});
});

angular.module('app').run(function ($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
		if (rejection === 'not authorized') {
			$location.path('/');
		}
	});
});
