angular.module('myApp',['Service','ngRoute'])
//配置路由
.config(['$routeProvider',function($routeProvider){

	$routeProvider

	//访问的时候，在/前面一定要给它加上#号
	.when('/home',{
		//template 指定当前路径所要显示的内容
		//templateUrl 指定当前路径索要显示的页面地址----> 相对地址
		//template: "<h1>hello</h1>",
		templateUrl: "home.html",
		controller: 'bodyController'
	})
	.when('/goods',{
		//template 指定当前路径所要显示的内容
		//templateUrl 指定当前路径索要显示的页面地址----> 相对地址
		//template: "<h1>hello</h1>",
		templateUrl: "goods.html",
		controller: 'goodsController'
	})
	.otherwise('/home')

}])
//home页面的控制器
.controller('bodyController',function($scope,getData){

//	页面一进入 总数和总价格默认为0
	$scope.totalNum = 0;
	$scope.totalPrice = 0;
	
//	页面进入调用获取总数和总价格的方法
	getTotalPrice();

//	json数据请求服务方法调用
	getData.getNav();
//	监听获取数据
	$scope.$on('getNav',function(event,data){
		$scope.navData = data;	
		
		//默认显示主菜的数据
		//dinnerList 右侧列表的变量
		$scope.dinnerList = data[0].items;  //菜品数据
		$scope.dinnerTitle = data[0].name;  //右侧的标题
		//调用方法，页面一加载 获取localstorage的存储数据
		init();
		
	});
//	左侧菜单的点击切换事件
	$scope.changeNav = function(index){
		//首先把所有菜单的数据里面的ifChose改为false
		angular.forEach($scope.navData,function(val,key){
			val.ifChose = false;
		});
		//把当前点击的菜单数据ifChose改成true
		$scope.navData[index].ifChose = true;
		//把右侧的菜品数据，切换成当前点击的导航下的菜品数据
		$scope.dinnerList = $scope.navData[index].items;
		$scope.dinnerTitle = $scope.navData[index].name;
		
		init();//切换菜单的时候也要读取相应的数据
	}
	//因为$scope.dinnerList没有定义,所有要放在on里面,在on里面调用方法
	function init(){
	//页面一进入，来判断localStorage.dinner有没有存储东西
		if(localStorage.dinner){
			//定义一个空数组，用来存储localStorage获得的数据
			var arr = [];
			//获取localStorage名字为dinner的数据复制给arr数组.localStorage存储的是字符串,需要转换为对象
			arr = JSON.parse(localStorage.dinner);
			//把存储在localStorage里面的数量 num 赋值给$scope.list
			for(var i=0;i<arr.length;i++){
				for(var j=0;j<$scope.dinnerList.length;j++){
					if($scope.dinnerList[j].id == arr[i].id){
						$scope.dinnerList[j].num = arr[i].num;
					}
				};	
			};
		};
	}

	
	//加减的点击事件
	$scope.reduce = function(index){
//		当num小于0的时候,num置为0
		if($scope.dinnerList[index].num <= 0){
			$scope.dinnerList[index].num = 0;
		}else{
//			点击减少对应index的num值
			--$scope.dinnerList[index].num;
			//当前点击的菜品数据 $scope.dinnerList[index]
			$scope.totalPrice -= $scope.dinnerList[index].price;
			$scope.totalNum -=1;
			
			//把localStorage里面的数据提出来
			var arr = [];
			arr = JSON.parse(localStorage.dinner);
//			循环把对应的菜品数据的num值改变后再存入localStorage
			for (var i=0;i<arr.length;i++) {
				//判断是不是同一个菜品
				if(arr[i].id == $scope.dinnerList[index].id){
					--arr[i].num;
				}
			}
			localStorage.dinner = JSON.stringify(arr);
		}
	}
//	增加按钮
	$scope.add = function(index){
		++$scope.dinnerList[index].num;
//		计算当前总价
		$scope.totalPrice += $scope.dinnerList[index].price;
		$scope.totalNum += 1;
		
		//把localStorage里面的数据提出来
			var arr = [];
		//首先得判断localStorage.dinner有没有数据，如果没有数据直接把他解析出来，会报错
			if(localStorage.dinner){
				arr = JSON.parse(localStorage.dinner);
			};
//		通过数组保留原来数据,不然会覆盖	问题：会有两个相同的数据，
		//判断当前菜品在localstorage。dinner 里面有没有，如果有，直接给他num+1
		var flag = true;
//		判断是否是同一个数组,如果是,只讲对应菜品数据的num值改变,而不push到arr数组中;
		for (var i=0;i<arr.length;i++) {
//			判断是不是同一个菜品
			if(arr[i].id == $scope.dinnerList[index].id){
				++arr[i].num;
				flag=false;//当遇到相等的时候,开关为false
			}
		}
//		只要当不是同一个数据的时候才会push到数组中
		if (flag) {
			arr.push($scope.dinnerList[index]);
		}
		localStorage.dinner = JSON.stringify(arr);	
	};
	//计算总价以及总数
	function getTotalPrice(){
		var arr = [];
		if(localStorage.dinner){
			arr = JSON.parse(localStorage.dinner);
		}
		angular.forEach(arr,function(val,key){
			$scope.totalPrice += val.num*val.price;
			$scope.totalNum += val.num;
		})
	}

	//进入订单页面按钮
	$scope.goGoods = function(){
		window.location.href = '#/goods';
	}
})



//订单页面控制器
.controller('goodsController',function($scope){
	//页面一进入将local的数据传给goodsData
	$scope.goodsData = JSON.parse(localStorage.dinner);
	
	
	//	页面一进入 默认为0		
	$scope.totalNum = 0;
	$scope.totalPrice = 0;
	getTotalPrice();
	//加减的点击事件
	$scope.add = function(index){
		++$scope.goodsData[index].num;
		//计算当前总价	
		$scope.totalPrice += $scope.goodsData[index].price;
		$scope.totalNum += 1;
		localStorage.dinner = JSON.stringify($scope.goodsData);	
	};
		
	
	$scope.reduce = function(index){
		if($scope.goodsData[index].num <= 0){
			$scope.goodsData[index].num = 0;
		}else{
			--$scope.goodsData[index].num;
	//		对num=0的数组删除
//			if($scope.goodsData[index].num == 0){
////				$scope.goodsData.splice(index,1)
//			}
				
				
		
			//计算当前总价
			console.log($scope.goodsData[index].num)
			$scope.totalPrice -= $scope.goodsData[index].price;
			localStorage.dinner = JSON.stringify($scope.goodsData);
			$scope.totalNum -= 1;
		}
	}
	//计算总价以及总数
	function getTotalPrice(){
		var arr = [];
		if(localStorage.dinner){
			arr = JSON.parse(localStorage.dinner);
		}
		angular.forEach(arr,function(val,key){
			console.log(val)
			$scope.totalPrice += val.num*val.price;
			$scope.totalNum += val.num;
		})
	}
	//返回首页
	$scope.backHome = function(){
		window.location.href = '#/home'
	}

})
