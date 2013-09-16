app.controller("FavoritesController", ["$scope", "Favoriter", function($scope, Favoriter) {
	$scope.favorites = Favoriter.favorites;
	
	$scope.$on("set-price", function(message, item, price, hq) {
		Favoriter.setPrice(item, price, hq);
	});
}]);
