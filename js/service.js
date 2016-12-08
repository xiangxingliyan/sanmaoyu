angular.module('Service',[])
.service('getData',function($http,$rootScope){
	return{
		"getNav":function(){
			$http.get('json/groups.json',{})
			.then(function(res){
				console.log(res.data);
				$rootScope.$broadcast('getNav',res.data);
			},function(error){
				
			})
		}
//		"goods":function(){
//			$http.get('json/goods.json',{})
//			.then(function(res){
////				console.log(res.data)
//			$rootScope.$broadcast('goods',res.data);
//			})
//		}
	}	
})
