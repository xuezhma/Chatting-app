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
});

myApp.controller('secondController', ['$scope', '$filter', '$timeout', '$http', '$log', '$location', function($scope, $filter, $timeout, $http, $log, $location){
	
}]);


myApp.controller('mainController', ['$scope', '$filter', '$timeout', '$http', '$log', function($scope, $filter, $timeout, $http, $log){

	if(getQueryVariable('name') == undefined){
		$scope.name = 'We will use your email as your display name before you set one.';
	}else{
		$scope.name = 'Welcome. ' + getQueryVariable('name') +'!';
	}
	$scope.email = getQueryVariable('email');
	

	

}]);


