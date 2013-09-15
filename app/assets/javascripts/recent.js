app.controller("RecentController", ["$scope", function($scope) {
	var RECENT_SIZE = 10;
	
	$scope.recent = [];
	
	$scope.$on("select-item", function(message, item) {
		$scope.$apply(function() {
			recentItem = $.extend({}, item);
			delete recentItem.$$hashKey;
			$scope.recent.unshift(recentItem);
			if ($scope.recent.length > RECENT_SIZE) {
				$scope.recent.splice(RECENT_SIZE, $scope.recent.length - RECENT_SIZE);
			}
			localStorage.setObject("search.recent", $scope.recent);
		});
	});
}]);
