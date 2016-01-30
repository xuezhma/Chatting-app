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
	// chat room page
	.when('/fifth',{
		templateUrl: 'pages/chatII.html',
		controller: 'mainController'
	})
	// in case ppl change hash for fun
	.when('/404', {
		templateUrl: 'pages/ops.html',
		controller: 'mainController'
	})

	.otherwise({redirectTo: '/404'})
});


myApp.controller('mainController', ['$scope', '$rootScope', '$location', '$filter', '$timeout', '$http', '$log', function($scope, $rootScope, $location, $filter, $timeout, $http, $log){
	
	$scope.$watch('$root.room', function(newValue, oldValue){
		console.info('Changed!');
		console.log('Old: ' + oldValue);
		console.log('New: ' + newValue);
		if(typeof(newValue)!==undefined && newValue.length !==0){
			$rootScope.iframe = 'chat.html?name=' + $rootScope.session.name + '&room=' + $rootScope.room +'&email=' + $rootScope.session.email;
		}
		$log.info($rootScope.iframe);
	});

	$scope.addroom = function(){
	
	}
	$rootScope.inchat;
	$rootScope.room = '';
	
	$scope.username = '';
	$scope.init = function () {
		// get user info from client session onload
		// if there is no session, kick him to sign in page
		$http.get('/welcome')
        .success(function(data) {
            console.log("User info: " + data);
            $rootScope.session = data;
            console.log("User info: " + $rootScope.session.name);
            if(typeof($rootScope.session.name) === undefined){
	    		$rootScope.session.name = $rootScope.session.email; 
	    		$scope.name = 'We will use your email as your display name before you set one.';
	    	}else{
	    		$scope.name = 'Welcome! ' + $rootScope.session.name;
	    	}
        })

        .error(function(data) {
            console.log('Error: ' + data);
      		// bye
            window.location.href = "../#/login";
        });

	    

		
	}
	

	

}]);


