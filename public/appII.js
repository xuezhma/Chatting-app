var myApp = angular.module('myApp', ['ngRoute']);
// minify AngularJS looks like:
// myApp.controller("mainController",["$scope","$log", function(a,b){
// 	b.info(a);
// }]);


// SPA routing 
myApp.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	})
	// change name
	.when('/second',{
		templateUrl: 'pages/second.html',
		controller: 'mainController'
	})
	// join chat
	.when('/third',{
		templateUrl: 'pages/third.html',
		controller: 'mainController'
	})
	// new password
	.when('/fourth',{
		templateUrl: 'pages/fourth.html',
		controller: 'mainController'
	})

	.when('/fifth',{
		templateUrl: 'pages/chatII.html',
		controller: 'mainController'
	})
});


myApp.controller('mainController', ['$scope', '$rootScope', '$filter', '$timeout', '$http', '$log', function($scope, $rootScope, $filter, $timeout, $http, $log){
	
	$scope.$watch('$root.room', function(newValue, oldValue){
		console.info('Changed!');
		console.log('Old: ' + oldValue);
		console.log('New: ' + newValue);
		if(typeof(newValue)!==undefined && newValue.length !==0){
			$rootScope.iframe = 'chat.html?name=' + $scope.username + '&room=' + $rootScope.room;
		}
		$log.info($rootScope.iframe);
	});

	$scope.addroom = function(){
	
	}
	$rootScope.inchat;
	$rootScope.room = '';
	
	$scope.username = '';
	// if a user is logged in, he sees tabs like 'change password'
	// if not, he sees tabs like 'Log in'
	if(typeof(getQueryVariable('email')) === undefined){
		$scope.login = 0;
	}else{
		$scope.login = 1;
		$scope.email = getQueryVariable('email');
		if(typeof(getQueryVariable('name')) === undefined){
			$scope.username = $scope.email;
			$scope.name = 'We will use your email as your display name before you set one.';
		}else{
			$scope.username = getQueryVariable('name');
			$scope.name = 'Welcome. ' + getQueryVariable('name') +'!';
		}
	}

	
	
	

	

}]);


