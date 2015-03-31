angular.module( "app.services", [] )
.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
})
.factory('UserService', function ($http,$ionicPopup) {
    return {
        signIn: function(username, password) {
            return $http.post(options.api.base_url + '/login', {name: username, pass: password} );
 
        },

        logOut: function() {
            return $http.get(options.api.base_url + '/user/logout');
        },

        register: function(username, password, passwordConfirmation) {
            return $http.post(options.api.base_url + '/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
        }
        
    }
})
.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.NbrcToken =  $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

/* Set Authentication.isAuthenticated to true if 200 received */

        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

/* Revoke client authentication if 401 is received */

        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
})

/*消息显示服务*/
.factory('PopupService', function ($ionicPopup, $timeout) {
    return {
        showAlert: function(message) {
     	   var alertPopup = $ionicPopup.alert({
     	     title: '<strong>消息提示</strong>',
     	     template:'<p style="text-align:center">'+message+'</p>',
     	     okText: '确定',
     	     okType:'button-calm'
     	   });
     	   alertPopup.then(function(res) {
     	     console.log(message);
     	   });
     	  $timeout(function() {
     		 alertPopup.close(); //close the popup after 3 seconds for some reason
     	  }, 3000);
     	 },
     	showConfirm:  function(message) {
     		var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '<p style="text-align:center">'+message+'</p>',
            okText: '确定',
            cancelText: '取消'
           });

        confirmPopup.then(function (res) {
            if (res) {
//                ionic.Platform.exitApp();
            } else {
                // Don't close
            }
           });
        $timeout(function() {
        	confirmPopup.close(); //close the popup after 3 seconds for some reason
    	  }, 3000);
         }
    }
})
