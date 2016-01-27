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

	.when('/second',{
		templateUrl: 'pages/second.html',
		controller: 'mainController'
	})

	.when('/third',{
		templateUrl: 'pages/third.html',
		controller: 'mainController'
	})

	.when('/fourth',{
		templateUrl: 'pages/fourth.html',
		controller: 'mainController'
	})

	.when('/fifth',{
		templateUrl: 'pages/chatII.html',
		controller: 'mainController'
	})
});

myApp.controller('secondController', ['$scope', '$filter', '$timeout', '$http', '$log', '$location', function($scope, $filter, $timeout, $http, $log, $location){
	
}]);


myApp.controller('mainController', ['$scope', '$rootScope', '$filter', '$timeout', '$http', '$log', function($scope, $rootScope, $filter, $timeout, $http, $log){
	$scope.iframe = "chat.html?name=name&room=Room+Name";
	$scope.addroom = function(){
	
	}
	$rootScope.inchat = 0;
	$scope.room = "";
	$scope.username = '';
	// if a user is logged in, he sees tabs like 'change password'
	// if not, he sees tabs like 'Log in'
	if(getQueryVariable('email') == undefined){
		$scope.login = 0;
	}else{
		$scope.login = 1;
		$scope.email = getQueryVariable('email');
		if(getQueryVariable('name') == undefined){
			$scope.username = $scope.email;
			$scope.name = 'We will use your email as your display name before you set one.';
		}else{
			$scope.username = getQueryVariable('name');
			$scope.name = 'Welcome. ' + getQueryVariable('name') +'!';
		}
	}

	
	
	

	

}]);


