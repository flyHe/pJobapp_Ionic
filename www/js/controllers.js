
angular.module( "app.controllers", [] )

.controller('appCtrl', function($scope,$location,$window,AuthenticationService) {
    $scope.logOut=function(){
         if (AuthenticationService.isAuthenticated) {
           AuthenticationService.isAuthenticated = false;
                 delete $window.sessionStorage.token;
                 $location.path("/");
         }
      }
})
/*新闻第一页*/
.controller("newsCtrl", ["$scope", "$http","$ionicSideMenuDelegate",'PopupService',
  function( $scope, $http,$ionicSideMenuDelegate,PopupService){
          /*获取新闻频道*/
      $http.get(options.api.base_url+"/channels")
        .success(function(data){
	          $scope.channels = data;
              $scope.defaultchannelid=data[0].id; 
              $scope.page=1;
              $scope.items = [];
              $http.get(options.api.base_url+"/news/"+ $scope.defaultchannelid+"/"+$scope.page)
             .success(function(data) { $scope.items = data.rows;});
        })
        .error(function(data,status,headers,config){
        	PopupService.showAlert( "无法连接服务"); //一些错误处理代码
        	
        });
      
      /*toggleLeft 点击显示左侧菜单 */
      $scope.toggleLeft = function() {
    	    $ionicSideMenuDelegate.toggleLeft();
    	  };

}])

/*频道下新闻列表*/
.controller("newsListCtrl",  ["$scope","$http","$stateParams",
        function( $scope,  $http ,$stateParams){
             	$scope.items = [];
                $scope.channelId =$stateParams.channelId;
                $scope.page = 1;
                $scope.moreDataCanBeLoaded=true;
                $scope.loadMore = function() {
                $http.get(options.api.base_url+"/news/"+$scope.channelId+"/"+$scope.page)
                    .success(function(data) {
                   
                    	var datarows=data.rows;
                    	/*alert(datarows);*/
                if(datarows !=''){
                	if(data.page!=$scope.ppage){
                    var count=datarows.length;
                    for (var i = 0; i < count; i++) {
                        $scope.items.push(datarows[i]);
                                 }
                    $scope.ppage= $scope.page;
                    $scope.page+= 1 ;}
                    $scope.$broadcast('scroll.infiniteScrollComplete');}
                else{       /*alert( "no more Data"); */
                        $scope.moreDataCanBeLoaded=false;}
                     } )
                    .error(function(data,status,headers,config){
                        /*alert( "no more Data"); //一些错误处理代码*/
                        $scope.moreDataCanBeLoaded=false;
                    })
            };
            $scope.$on('$stateChangeSuccess', function() {
                $scope.loadMore();
            });
}])


/*获取详细新闻*/
.controller("newsDetailCtrl", ["$scope","$http","$stateParams",
        function( $scope,  $http ,$stateParams){
            //alert("$scope.newsListId");
            $scope.newsListId=$stateParams.newsListId;
           // alert($scope.newsListId);
            /*获取详细新闻内容*/
      $http.get(options.api.base_url+"/newsinfo/"+$scope.newsListId).success(function(data){
          $scope.newsDetail = data;
         /* document.getElementById("newsDetail.content").innerHTML = $scope.newsDetail.content;*/
          //alert( $scope.newsDetail);
      });
      /*获取相关新闻标签*/
      $http.post(options.api.base_url + '/tag', {newsId: $scope.newsListId} )
         .success(function(data){
   	    $scope.tags=data;	
            });
 }])

 /*tagNews获取标签新闻*/
.controller("tagNewsCtrl",  ["$scope","$http","$stateParams",
        function( $scope,  $http ,$stateParams){
             	$scope.items = [];
                $scope.tagName =$stateParams.tagName;
               
                $scope.page = 1;
                $scope.moreDataCanBeLoaded=true;
                $scope.loadMore = function() {
                $http.post(options.api.base_url+"/tagNews", {tagName: $scope.tagName,page: $scope.page} )
                    .success(function(data) {
                   
                    	var datarows=data.rows;
                    	/*alert(datarows);*/
                if(datarows !=''){
                    var count=datarows.length;
                    for (var i = 0; i < count; i++) {
                        $scope.items.push(datarows[i]);
                                 }
                    $scope.page+= 1 ;
                    $scope.$broadcast('scroll.infiniteScrollComplete');}
                else{       /*alert( "no more Data"); */
                        $scope.moreDataCanBeLoaded=false;}
                     } )
                    .error(function(data,status,headers,config){
                        /*alert( "no more Data"); //一些错误处理代码*/
                        $scope.moreDataCanBeLoaded=false;
                    })
            }; 
            $scope.$on('$stateChangeSuccess', function() {
                /*$scope.loadMore();*/
            });
}])

/*搜索主界面*/
    .controller("searchCtrl", ["$scope","$http",
        function( $scope,  $http){

 		/*常用关键字*/
         $http.post(options.api.base_url+"/getKeys")
         .success(function(data){
 		$scope.usualKeys = data;})
 		
 		/*获取近三天关键字*/
    	 $http.post(options.api.base_url+"/keys")
         .success(function(data){
 		$scope.recentKeys = data.rows;})
 		
        }])

   /*搜索结果*/
    .controller("searchResultCtrl",  ["$scope","$http","$stateParams",'PopupService',
       
        function( $scope,$http ,$stateParams,PopupService){

            $scope.searchResults = [];
            $scope.key=$stateParams.key;
            $scope.page = 1;
            $scope.moreDataCanBeLoaded=true;
            $scope.loadMore = function() {
            $http.get(options.api.base_url+"/search/"+$scope.key+"/"+$scope.page)
                .success(function(data) {
                	var dataitems=data.items;
             if(dataitems !=''){
            	 if($scope.ppage!=$scope.page){
                    var count=dataitems.length;
                    for (var i = 0; i < count; i++) {
                        $scope.searchResults.push(dataitems[i]);
                    }
                    $scope.ppage=$scope.page
                    $scope.page+= 1 ;}
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
              else{       /*alert( "no more Data"); */
                $scope.moreDataCanBeLoaded=false;}
            } )
                .error(function(data,status,headers,config){
                	PopupService.showAlert( "搜索失败");
                	
                    $scope.moreDataCanBeLoaded=false;
                })
        };
        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
        });
    }])
    
    /*工作详细*/
    .controller("resultCtrl",  ["$scope","$http","$stateParams",'PopupService',
        function( $scope,  $http ,$stateParams,PopupService){
        
            $scope.jobId=$stateParams.jobId;
             /*alert($scope.jobId);*/
            $http.get(options.api.base_url+"/jobinfo/"+$scope.jobId).success(function(data){
                $scope.result = data;
                /*document.getElementById("result.description").innerHTML = $scope.result.description;*/
               
            })
                .error(function(data,status,headers,config){
                    //一些错误处理的代码
                	PopupService.showAlert("详细工作信息返回失败")
                	
                })
              
                /*添加收藏功能*/
                $scope.setCollection=function setCollection(jobid){
            	     $http.post(options.api.base_url + '/addcoll', {jobid: jobid} )
            	          .success(function(data){
            	        	  PopupService.showAlert(data.message);           	    	     
                   
                             })
                          .error(function(data,status,headers,config){
                       //一些错误处理的代码
                        	  PopupService.showAlert("添加收藏失败");
                        	 
                             })
            }
                        
            /*投递简历功能*/
            $scope.addreceive=function addreceive(jobid){   	
       	     $http.post(options.api.base_url + '/addreceive', {jobId: jobid} )
       	          .success(function(data){
       	        	PopupService.showAlert(data.message);       	        	 
              
                        })
                     .error(function(data,status,headers,config){
                   //一些错误处理的代码
                    	 PopupService.showAlert("投递简历失败");
                    	  
                        })
       }
            
        }])

       /* 我的收藏*/
    .controller("collectionCtrl", ["$scope", "$http",'PopupService',
        function( $scope, $http,PopupService){

            $http.get(options.api.base_url+"/collection")
                .success(function(data){
                    $scope.collection = data.rows;
       
                })
                .error(function(data,status,headers,config){
                	PopupService.showAlert( "无法连接服务器"); //一些错误处理代码
                	 
                });

            /*下拉刷新收藏*/
            $scope.doReFresh=function(){
            	$http.get(options.api.base_url+"/collection")
                .success(function(data){
                    $scope.collection = data.rows;
       
                })
                .error(function(data,status,headers,config){
                	PopupService.showAlert( "无法连接服务器"); //一些错误处理代码
                })
                .finally(function() {
                          // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                        })
                ;  }
            
        }])
        
       /* 更多功能*/
     .controller("moreCtrl", ["$scope","$http",
        function( $scope,  $http){  
        	/*多少人查看了我的简历*/
    	 $http.post(options.api.base_url+"/view")
        	.success(function(data) {$scope.totalChecked=data.total})  ;    
        	
       }])

      /*简历查看记录*/
      .controller("resumeCheckedCtrl", ["$scope","$http",
           function( $scope,  $http ){
          $scope.checkedRecords = [];
          
          $scope.page = 1;
          $scope.moreDataCanBeLoaded=true;
          $scope.loadMore = function() {       	 
          $http.post(options.api.base_url+"/view",{page: $scope.page})
              .success(function(data) {
             
              	var datarows=data.rows;
              	/*alert(datarows);*/
          if(datarows !=''){
              var count=datarows.length;
              for (var i = 0; i < count; i++) {
                  $scope.checkedRecords.push(datarows[i]);
                           }
              $scope.page+= 1 ;
              $scope.$broadcast('scroll.infiniteScrollComplete');}
          else{       /*alert( "no more Data"); */
                  $scope.moreDataCanBeLoaded=false;}
               } )
              .error(function(data,status,headers,config){
                  /*alert( "no more Data"); //一些错误处理代码*/
                  $scope.moreDataCanBeLoaded=false;
              })
      };
      $scope.$on('$stateChangeSuccess', function() {
         /* $scope.loadMore();*/
      });    
       }])
       
    /*摇一摇*/
       .controller("sensorCtrl", ["$scope","$http","$cordovaGeolocation","$cordovaDeviceMotion","$cordovaVibration",
        function( $scope,$http,$cordovaGeolocation,$cordovaDeviceMotion,$cordovaVibration){  
    	 
        	/*监测摇动情况*/
    	   var watch;
    	   
    	   $scope.getAcceleration = function () {
    	     $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
    	       // Success! 
    	     }, function(err) {
    	    	 alert("无法获取加速度") // An error occured. Show a message to the user
    	     });
    	   };
    	  
    	   $scope.watchAcceleration = function () {
    	     var options = { frequency: 1000 };  // Update every 1 second
    	  
    	     watch = $cordovaDeviceMotion.watchAcceleration(options);
    	  
    	     watch.promise.then(
    	       function() {/* unused */},  
    	       function(err) {},
    	       function(acceleration) {
    	    	   var X = acceleration.x;
    	           var Y = acceleration.y;
    	           var Z = acceleration.z;
    	           var timeStamp = acceleration.timestamp;
    	           
    	           $scope.x = acceleration.x;
    	           $scope.y = acceleration.y;
    	           $scope.z = acceleration.z;
    	           
    	        /* alert('Acceleration X: ' + acceleration.x + '\n' +
    	            'Acceleration Y: ' + acceleration.y + '\n' +
    	            'Acceleration Z: ' + acceleration.z + '\n' +
    	            'Timestamp: '      + acceleration.timestamp + '\n');*/
    	         var speed = Math.abs(X)+ Math.abs(Y)+ Math.abs(Z);
    	        /* alert(speed);*/
    	         if(speed>20){
    	        	 /*$scope.clearWatch();*/
    	        	 $scope.loading=true;
   		    	     $cordovaGeolocation.getCurrentPosition().then(function (position) {  		    	     
   		    	      $scope.lat  = position.coords.latitude
   		    	      $scope.long = position.coords.longitude
   		    	     /* alert("lat="+$scope.lat+";long="+$scope.long);*/
   		    	   // Vibrate 200ms
   		    	      $cordovaVibration.vibrate(200);
   		    	      $scope.loading=false;
   		    	    }, function(err) {
   		    	      alert("无法获取位置信息")// error		    	      
   		    	    });
    	         }
    	     });
    	   };
    	  
    	   $scope.clearWatch = function() {
    	   // use watchID from watchAccelaration()
    	  
    	     if(!watch) { return; }
    	  
    	     $cordovaDeviceMotion.clearWatch(watch.watchId).then(function(result) {
    	       // Success! 
    	     }, function(err) {
    	       // An error occured. Show a message to the user
    	  
    	     });
    	   };
    	 $scope.$on('$stateChangeStart', function() {
    		 $scope.clearWatch();
    	      });  

    	   $scope.watchAcceleration();
      
    	   
    	   
    	  /* $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
    		    var X = result.acceleration.x;
		        var Y = result.acceleration.y;
		        var Z = result.acceleration.z;
		        var timeStamp = result.acceleration.timestamp;
		        alert("X="+X+";Y="+Y+";Z="+Z+"timeStamp="+timpStamp) ;
   		       alert("success");
    		    	  $scope.loading=true;
    		    	  $cordovaGeolocation.getCurrentPosition().then(function (position) {
    		    	      var lat  = position.coords.latitude
    		    	      var long = position.coords.longitude
    		    	      alert("lat="+lat+";long="+long)
    		    	      $scope.loading=false;
    		    	    }, function(err) {
    		    	      alert("无法获取位置信息")// error		    	      
    		    	    });
    		    }, function(err) {
    		    	  alert("无法获取加速度") // An error occured. Show a message to the user
    		    	 
    		    });*/
    		 
    	  /* Geolocation
    	   $cordovaGeolocation.getCurrentPosition().then(function (position) {
	    	      var lat  = position.coords.latitude
	    	      var long = position.coords.longitude
	    	      alert("lat="+lat+";long="+long)
	    	    }, function(err) {
	    	      alert("无法获取位置信息")// error
	    	      $scope.loading=true;
	    	    });*/
    	   
       }])
       
    /*用户管理 */  
      .controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService','$ionicLoading','PopupService',
         function($scope, $location, $window, UserService, AuthenticationService,$ionicLoading,PopupService) {

        //Admin User Controller (signIn, logOut)
        $scope.signIn = function signIn(username, password) {
        	
            if (username != null && password != null) {
            	$ionicLoading.show({
                    template: '登录中...'
                });
                UserService.signIn(username, password).success(function(data) {
                	/*alert(data.success+data.message+name);*/
                	if(data.success){
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.data;
                    $location.path("/news");
                    $ionicLoading.hide();}
                    else{$ionicLoading.hide();
                    PopupService.showAlert("用户名或者密码错误");
//                    	alert("错误的用户名或密码");
                    }
                }).error(function(status, data) {
                	 $ionicLoading.hide();
//                    alert("无法连接服务");
                	 PopupService.showAlert("无法连接服务");                   
                });
            }
        }

        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }
        

       /* $scope.register = function register(username, password, passwordConfirm) {
            if (AuthenticationService.isAuthenticated) {
                $location.path("/admin");
            }
            else {
                UserService.register(username, password, passwordConfirm).success(function(data) {
                    $location.path("/admin/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }*/
    }
]);


