var myApp = angular.module('myApp', ['ngRoute']);
// minify AngularJS looks like:
// myApp.controller("mainController",["$scope","$log", function(a,b){
// 	b.info(a);
// }]);

// avatar img validation
myApp.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
});

// form validation
// check if a display name is claimed by a registered user when ppl want to use it 
myApp.directive('nameDirective', ['$http', '$log', function($http, $log) {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {
                if (value.length > 0) {
                	$http.post('/displayname', {name: value})
	            	.success(function(data){
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

	.when('/',{
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	})
	// mailbox-compose
	.when('/compose',{
		templateUrl: 'pages/compose.html',
		controller: 'mainController'
	})
	// mailbox-inbox
	.when('/inbox',{
		templateUrl: 'pages/inbox.html',
		controller: 'mainController'
	})
	// mailbox-draft
	.when('/draft',{
		templateUrl: 'pages/draft.html',
		controller: 'mainController'
	})
	// mailbox-sent
	.when('/sent',{
		templateUrl: 'pages/sent.html',
		controller: 'mainController'
	})
	// mailbox-spam
	.when('/spam',{
		templateUrl: 'pages/spam.html',
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
	// personal message history
	.when('/history',{
		templateUrl: 'pages/history.html',
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
	
	// Call moment for message history
	$scope.moment = function(timestamp) {
		return moment.utc(timestamp).local().format('MMM Do, YYYY h:mm a');
	}
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
	$scope.messages;
	$scope.change;			// for editing avatar img
	$scope.username = '';
	// APIs start here: 
	// get user info from session, get message history 
	$scope.init = function () {
		// get user info from session onload
		// if there is no session, kick him to sign in page
		$http.get('/welcome')
        .success(function(data) {
            console.log("User info: " + data);
            $rootScope.session = data;
            $rootScope.session.url = $rootScope.session.url || "https://cdn3.iconfinder.com/data/icons/rcons-user-action/32/boy-512.png";
            console.log("User infoII: " + $rootScope.session.email);
            if ($rootScope.session.email === undefined){
            	console.log("wow");
            	window.location.href = "../#/login";
            }

            if($rootScope.session.name === undefined){
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


        // get user message history, a list of message objects
		$http.get('/history')
        .success(function(data) {
            $scope.messages = data;
            console.log('messages: ', data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
      		// bye
            window.location.href = "../#/ops";
        });
	}

	// update
	$scope.updateUrl = function() {
		$rootScope.session.url = $scope.url;
		$http.post('/updateUrl', {url: $scope.url})
		.then(function(data) {
			$scope.change = 1;
		}, function(data) {
			// default avatar img
			$rootScope.session.url = "https://cdn3.iconfinder.com/data/icons/rcons-user-action/32/boy-512.png"; 
			$log.error("Error updating url");
		});

	}

	//log out, destory session
	$scope.logout = function() {
		$http.get('/logout')
        .success(function(data) {
            $scope.messages = data;
            $log.info('messages: ', data);
        })
        .error(function(data) {
            $log.error('Error: ' + data);
      		// bye
            window.location.href = "../#/ops";
        });
	}

	$scope.compose = function() {
		var mail = {
			name: $scope.toName,
			subject: $scope.subject,
			content: $scope.content
		}

		$http.post('/compose', mail)
		.then(function(data) {
			alert('success: ', data);
			$scope.toName = "";
			$scope.subject = "";
			$scope.content = "";

		}), function(data) {
			alert('not success: ', data)
		}
	}

	// APIs end here
	
	

}]);


