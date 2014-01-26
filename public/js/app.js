app = angular.module('instantMCQ', ['ngRoute','instantMCQControllers']);

app.config(['$routeProvider','$locationProvider',
	function ($routeProvider,$locationProvider) {
		$routeProvider.
		when('/:error', {
			templateUrl: '/partials/home',
			controller: 'IndexCtrl'
		}).
		when('/screen/:screenName', {
			templateUrl: '/partials/screen',
			controller: 'ScreenCtrl'
		}).
		when('/controller/:screenName', {
			templateUrl: '/partials/controller',
			controller: 'ControllerCtrl'
		}).
		otherwise({
			redirectTo:'/'
		});
		$locationProvider.html5Mode(true);
	}]);