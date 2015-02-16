angular.module('app', ['ngResource', 'ngRoute', 'ui.select', 'ngDialog', 'ngAnimate']);

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
			controller: 'mvMainController',
			animation: 'view-transition'
		})
		.when('/questions/random', {
			template: '',
			controller: 'mvQuestionRandomController',
			animation: 'view-transition'
		})
		.when('/questions/:id', {
			templateUrl: '/partials/questions/question.jade',
			controller: 'mvQuestionController',
			animation: 'view-transition'
		})
		.when('/questions/tag/:tag', {
			templateUrl: '/partials/questions/tag/tag.jade',
			controller: 'mvTagViewController',
			animation: 'view-transition'
		})
		.when('/admin/users', { 
			templateUrl: '/partials/admin/users/user-list', 
			controller: 'mvUserListController',
			resolve: routeRolesCheck.admin,
			animation: 'view-transition'
		})
		.when('/admin/users/:id', { 
			templateUrl: '/partials/admin/users/user-detail', 
			controller: 'mvUserDetailController',
			resolve: routeRolesCheck.admin,
			animation: 'view-transition'
		})
		.when('/admin/questions', {
			templateUrl: '/partials/admin/questions/question-list',
			controller: 'mvQuestionListController',
			resolve: routeRolesCheck.admin,
			animation: 'view-transition'
		})
		.when('/admin/questions/:id', {
			templateUrl: '/partials/admin/questions/question-detail',
			controller: 'mvQuestionDetailController',
			resolve: routeRolesCheck.admin,
			animation: 'view-transition'
		})
		.when('/signup', {
			templateUrl: '/partials/account/signup',
			controller: 'mvUserSignupController',
			animation: 'view-transition'
		})
		.when('/profile', {
			templateUrl: '/partials/account/profile',
			controller: 'mvProfileController',
			resolve: routeRolesCheck.user,
			animation: 'view-transition'
		});
});

angular.module('app').run(function ($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
		if (rejection === 'not authorized') {
			$location.path('/');
		}
	});
	$rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute){
		$rootScope.animation = currentRoute.animation;
	});
});