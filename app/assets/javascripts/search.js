app.controller("SearchController", ["$scope", "Notepad", function($scope, Notepad) {
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
	
	$("#search-form").submit(function(e) {
		e.preventDefault();
		if ($scope.items != null && $scope.items.length > 0) {
			Notepad.selectItem($scope.items[0]);
		}
	});
}]);
