var SearchController = function($scope) {
	$scope.search = null;
	$scope.items = [];
	
	$scope.$watch("search", function() {
		if ($scope.search == null) {
			return;
		}
		$scope.items = $scope.search.length < 1 ? [] : ItemIndex.search($scope.search);
	});
	
	$scope.$on("remote-search", function(event, string) {
		$scope.$apply(function() {
			$scope.search = string;
		});
	});
};
