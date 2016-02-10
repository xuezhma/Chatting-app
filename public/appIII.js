var myApp = angular.module('myApp', ['ngRoute']);
// minify AngularJS looks like:
// myApp.controller("mainController",["$scope","$log", function(a,b){
// 	b.info(a);
// }]);

// form validation
// check if a display name is claimed by a registered user when guest users want to use it 
myApp.directive('nameDirective', ['$http', '$log', function($http, $log) {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
                if (value.length > 0) {
                	$http.post('/displayname', {name: value})
	            	.success(function(data){
	            		console.log(data);
	            		if(data == 'available'){
	            			mCtrl.$setValidity('charE', true);
	            		}else{
	            			mCtrl.$setValidity('charE', false);
	            		}
	            	})
	            	.error(function(data){
	            		$log.error('Error: ' + data);
	            		mCtrl.$setValidity('charE', false);
	            	});
                    
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
}]);

// SPA routing 
myApp.config(function($routeProvider){
	$routeProvider
	
	.when('/', {
		// do nothing, default hash
	})
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
	// iframe the chat in a view
	.when('/fifth',{
		templateUrl: 'pages/chatII.html',
		controller: 'mainController'
	})
	// in case ppl change hash for fun
	// no 404 doge page for guests
	.otherwise({redirectTo: '/'})
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

	$rootScope.room;
	$rootScope.username;
	$scope.home = 1;
	$scope.inchat = 0;
	if($location.$$url.length>1){
		$scope.home = 0;
	}
	// rounting for guest join chat on form submit
	$scope.submit = function() {
        $location.url('/fifth');
    };
	
	

}]);