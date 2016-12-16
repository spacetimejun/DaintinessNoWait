var myApp = angular.module('app',['ionic','cyfDirectives'])
myApp.controller('controller',['$scope','$http','$state','$ionicSlideBoxDelegate','$ionicScrollDelegate','$rootScope',function($scope,$http,$state,$ionicSlideBoxDelegate,$ionicScrollDelegate,$rootScope){
	
	//转到第一页
	$state.go('tabs.tab1');
	
	//改变搜索框透明度
	$scope.change=function(){
		var search=document.getElementById('searchBox');
		var aBg =document.getElementById('aBg');
		var btBg =document.getElementById('btBg');
		var y=$ionicScrollDelegate.$getByHandle('content1').getScrollPosition().top;
		
		search.style.background="rgba(253,254,254,"+(0.3+y/300)+")";
		if(y>=20){
			aBg.style.background="rgba(200,200,200,.8)";
			btBg.style.color='deeppink';
		}else{
			aBg.style.background="rgba(253,254,254,.8)";
			btBg.style.color='white';
		}
	}
	
	$scope.goWidth=function(){
    	var liBottom = document.getElementsByClassName('liBottom');
    	var x=(this.$index *liBottom[0].clientWidth)+"px";
    	$scope.x=x;
    	
    }
//	$scope.$on('xxxxx', function(e,phonenumber){
//		console.log(this.value);
//		console.log($scope.phonenumber)
//		
//	})
//  console.log($scope.phonenumber )
}])



//路由
myApp.config(['$ionicConfigProvider','$stateProvider',function ($ionicConfigProvider,$stateProvider) {
	
	$ionicConfigProvider.tabs.position('bottom');
	
    $stateProvider.state('tabs',{
    	url: '/tab',
    	cache: false,   //清缓存
    	abstract: true,
		templateUrl: 'tplTabs'
    }).state('tabs.tab1', {
        url: '/tab1',
        
        views:{
            view1: {
                templateUrl: "templates/tab_idx.html",
                controller: function ($scope, $state, $http,$ionicSlideBoxDelegate) {
                    
                    $http.get('js/banner.json').success(function (result) {
                        //轮播图
						$scope.banner=result.banner;
						$ionicSlideBoxDelegate.update();
						
						//功能小图标
						$scope.feature = result.feature;
						$ionicSlideBoxDelegate.update();
						
						//热门
						$scope.hot=result.hot;
						$ionicSlideBoxDelegate.update();
						
						//精选
						$scope.selection=result.selection;
						$ionicSlideBoxDelegate.update();
					
                    });
                    
                    //点击跳转到页面2
                    $scope.toTab2=function(){
                    	$state.go('tabs.tab2');
                    }
                }
            }
        }
    }).state('tabs.tab2', {
        url: '/tab2',
        
        cache: false,   //清缓存
        views: {
            view2:{
                templateUrl: "templates/yuyue.html",
                controller: function ($scope, $state, $http,$ionicSlideBoxDelegate,$timeout) {
                    $http.get('js/banner.json').success(function(result){
                    	$scope.list=[];
						$scope.list=result.order.slice(0,7);
//						console.log($scope.list);
						$ionicSlideBoxDelegate.update();
                    });
//                  
                    $scope.showR=true;
                    $scope.getData = function () {
                    	$timeout(function(){
                    		$http.get("js/banner.json").success(function (result) {
								$scope.list=$scope.list.concat(result.order);
								$scope.$broadcast("scroll.infiniteScrollComplete"); // 通知框架数据已加载完毕
								if($scope.list.length>=50){
									$scope.showR=false;
								}else{
									$scope.showR=true;
								}
								console.log($scope.list.length)
								
							});
                    	},800)
						
					};

                    
                }
            }
        }
    }).state('tabs.tab3', {
        url: '/tab3',
        cache: false,   //清缓存
        
        views: {
            view3:{
                templateUrl: "templates/guangchang.html",
                controller: function ($scope, $state, $http) {
                    
                }
            }
        }
    }).state('tabs.tab4', {
        url: '/tab4',
    	cache: false,   //清缓存
        views: {
            view4:{
                templateUrl: "templates/my.html",
                controller: function ($scope, $state, $http, $rootScope) {
                   
                    
                }
            }
        }
    }).state('detail', {
        url: '/detail/:id',
		cache: false,   //清缓存
            templateUrl: 'templates/detail.html',
            controller: function ($scope, $stateParams, $http,$rootScope) {
            	var id = $stateParams.id;
                $scope.id = id;
                $http.get('js/banner.json').success(function(result){
                	var data='';
                	//循环匹配id，找出相同id的对象
                	for(i=0;i<result.order.length;i++){
                		if(id==result.order[i].id){
                			//将匹配到的对象赋予data
                			var data = result.order[i]
                			//广播导出data的值
                			$rootScope.$broadcast('dataDemo', data );
                		}
                	}
                	//console.log(data);
                	
                });
    //$on 通过$on来接收广播的数据data；
	//$on  第一个参数就是接受广播的名字,第二个参数就是一个回调函数(回调函数里有两个参数，第一个参数不用管，第二个参数就是广播传过来的数据)
                $scope.$on('dataDemo', function(e,data){
					console.log(data.name);
					$scope.name=data.name;
					$scope.style=data.style;
					$scope.price=data.price;
					$scope.img=data.img;
					$scope.iconFont=data.iconFont;
					$scope.star=data.star;
					$scope.position=data.position;
				})
                
                var orderDay=[
                				{"id":1,"name":"今天"},
                				{"id":2,"name":"明天"},
                				{"id":3,"name":"后天"},
                				{"id":4,"name":"更多"}
                			];
                $scope.orderDays=orderDay;
               
                
                var buttonlist=['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00' ];
                $scope.buttonlist=buttonlist;
                	
            }
        
    }).state('login',{
    	url:'/login',
   		cache: false,   //清缓存
    	templateUrl: "templates/login.html",
    	controller:	function($scope,$stateParams,$ionicPopup, $http,$rootScope,$state,$ionicTabsDelegate){
    		
    		//对输入的电话号码进行数据处理
    		$scope.phoneNum=function(){
//	  			console.log(this.number)
//				console.log(this.number.length)
				if(this.number.length == 11){
					$scope.isRed=true;
					document.getElementById('yanzhengma').removeAttribute('disabled');
					
				}else{
					$scope.isRed=false;
					document.getElementById('yanzhengma').setAttribute('disabled','disabled');
				}
				//广播导出data的值
				$scope.phonenumber=this.number;
                $rootScope.$broadcast('xxxxx', $scope.phonenumber );
                $rootScope.$broadcast('xxxxx', this.number);
    		};
    		//获取验证码
    		
    		$scope.x=null;
    		$scope.sendNum=function(){
    			
				var randomNum=Math.round(Math.random()*10000);
				$ionicPopup.alert({
					title:'验证码',
					template:randomNum
				});
				
				
				$scope.x=randomNum;
    			
    		}
    		//验证码输入
    		$scope.writeNum={
    			yzm:null
    		};
    		$scope.testNum=function(){
    			console.log($scope.writeNum.yzm);
    			console.log($scope.x);
//  			console.log(writeNum.length);
    			if($scope.writeNum.yzm==$scope.x){
    				$scope.isRed2=true;
					document.getElementById('login').removeAttribute('disabled');
					
    			}else{
    				$scope.isRed2=false;
    				document.getElementById('login').setAttribute('disabled','disabled');
    			}
    		}
    		//登陆按钮
    		$scope.login=function(){
    			
 //   			console.log($scope.phonenumber )    所输入的电话号码
    			$ionicPopup.alert({
					title:'登陆成功',
					
					
				});
				
				//跳转到个人页面
				$state.go('tabs.tab4');
    		}
    	}
    });
}]);


myApp.run(function ($rootScope, $state, $ionicTabsDelegate) {
    $rootScope.$on('$ionicView.beforeEnter', function () {
        
//		
//      $ionicTabsDelegate.showBar($state.current.name != 'detail');
    });
});

