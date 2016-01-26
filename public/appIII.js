var myApp = angular.module('myApp', ['ngRoute']);
// minify AngularJS looks like:
// myApp.controller("mainController",["$scope","$log", function(a,b){
// 	b.info(a);
// }]);


// SPA routing 
myApp.config(function($routeProvider){
	$routeProvider

	.when('/join',{
		templateUrl: 'pages/guest.html',
		controller: 'mainController'
	})

	.when('/login',{
		templateUrl: 'pages/login.html',
		controller: 'mainController'
	})

	.when('/signup',{
		templateUrl: 'pages/signup.html',
		controller: 'mainController'
	})

	.when('/fifth',{ 
		templateUrl: 'chat.html',
		controller: 'mainController'
	})
});

myApp.controller('mainController', ['$scope', '$filter', '$timeout', '$http', '$log', function($scope, $filter, $timeout, $http, $log){
	$scope.home = 1;
	$scope.room = 'FAKEROOM';
	
	

}]);