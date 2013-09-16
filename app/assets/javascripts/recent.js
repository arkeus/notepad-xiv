app.controller("RecentController", ["$scope", function($scope) {
	var RECENT_SIZE = 26;
	
	$scope.recent = [];
	
	$scope.save = function() {
		localStorage.setObject("search.recent." + board, $scope.recent);
	};
	
	$scope.load = function() {
		var loaded = localStorage.getObject("search.recent." + board);
		if (typeof loaded !== "undefined" && loaded != null && loaded.length > 0) {
			for (var i = 0; i < loaded.length; i++) {
				if (typeof loaded[i].n != "string") {
					continue;
				}
				$scope.recent.push(loaded[i]);
			}
		}
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
	
	$scope.$on("set-price", function(message, item, price, hq) {
		$.each($scope.recent, function(index, recent) {
			if (recent.n == item.n) {
				if (hq) {
					recent.hqp = price;
				} else {
					recent.p = price;
				}	
			}
		});
		$scope.save();
	});
	
	$scope.load();
}]);
