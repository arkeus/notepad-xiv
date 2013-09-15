app.controller("RecentController", ["$scope", function($scope) {
	var RECENT_SIZE = 14;
	
	$scope.recent = [];
	
	$scope.save = function() {
		localStorage.setObject("search.recent", $scope.recent);
	};
	
	$scope.load = function() {
		return localStorage.getObject("search.recent");
	};
	
	$scope.$on("select-item", function(message, item) {
		$scope.$apply(function() {
			recentItem = $.extend({}, item);
			delete recentItem.$$hashKey;
			
			for (var i = 0; i < $scope.recent.length; i++) {
				var recentCheck = $scope.recent[i];
				if (recentCheck.n == recentItem.n) {
					$scope.recent.splice(i, 1);
					break;
				}
			}
			
			$scope.recent.unshift(recentItem);
			if ($scope.recent.length > RECENT_SIZE) {
				$scope.recent.splice(RECENT_SIZE, $scope.recent.length - RECENT_SIZE);
			}
			$scope.save();
		});
	});
	
	$scope.$on("set-price", function(message, item, price) {
		$.each($scope.recent, function(index, recent) {
			console.log(recent.n, item.n, item);
			if (recent.n == item.n) {
				recent.p = price;
			}
		});
		$scope.save();
	});
	
	$scope.recent = $scope.load();
}]);
