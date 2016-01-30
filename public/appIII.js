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
	// there is no fifth right now
	.when('/fifth',{
		templateUrl: 'pages/chatII.html',
		controller: 'mainController'
	})
});

myApp.controller('mainController', ['$scope', '$rootScope', '$location', '$filter', '$timeout', '$http', '$log', function($scope, $rootScope, $location, $filter, $timeout, $http, $log){
	
	$rootScope.inchat;
	$scope.$watch('$root.username', function(newValue, oldValue){
		console.info('Changed!');
		console.log('Old: ' + oldValue);
		console.log('New: ' + newValue);
		if(typeof(newValue)!==undefined && newValue.length !==0){
			$rootScope.iframe = 'chat.html?name=' + $rootScope.username + '&room=' + $rootScope.room;
		}
		$log.info($rootScope.iframe);
	});

	$scope.$watch('$root.room', function(newValue, oldValue){
		console.info('Changed!');
		console.log('Old: ' + oldValue);
		console.log('New: ' + newValue);
		if(typeof(newValue)!==undefined && newValue.length !==0){
			$rootScope.iframe = 'chat.html?name=' + $rootScope.username + '&room=' + $rootScope.room;
		}
		$log.info($rootScope.iframe);
	});

	$rootScope.room = '';
	$rootScope.username = '';
	$scope.home = 1;
	$scope.inchat = 0;
	if($location.$$url.length>1){
		$scope.home = 0;
	}
	
	
	

}]);