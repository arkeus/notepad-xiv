app.controller("NoteController", ["$scope", "$http", "Notepad", "Note", "Pricer", "Favoriter", function($scope, $http, Notepad, Note, Pricer, Favoriter) {
	$scope.item = null;
	$scope.hq = false;
	$scope.favorite = false;
	$scope.price = null;
	$scope.hqprice = null;
	$scope.recentNotes = Note.recent();
	$scope.notes = [];
	
	$scope.removeNote = function(collection, note) {
		for (var i = 0; i < collection.length; i++) {
			if (collection[i].id == note) {
				collection.splice(i, 1);
				break;
			}
		}
	};
	
	$scope.$on("select-item", function(message, item) {
		$scope.item = item;
		$scope.hq = false;
		$scope.favorite = Favoriter.isFavorite(item);
		$scope.notes = Note.list({ item: item.n }, function() {
			updatePrices();
		});
	});
	
	$scope.$on("remove-note", function(message, note) {
		$scope.$apply(function() {
			$scope.removeNote($scope.notes, note);
			$scope.removeNote($scope.recentNotes, note);
				
			$http.post("/" + board + "/remove", { note: note }).success(function(data, response) {
				updatePrices();
			});
		});
	});
	
	$scope.toggleFavorite = function() {
		if ($scope.favorite) {
			Favoriter.removeFavorite($scope.item);
		} else {
			Favoriter.addFavorite($scope.item);
		}
		$scope.favorite = !$scope.favorite;
	};
	
	$scope.toggleQuality = function() {
		$scope.hq = !$scope.hq;
	};
	
	var getPrice = function(notes, hq) {
		var max = 0, price = null, item = null;
		for (var i = 0; i < notes.length; i++) {
			var n = notes[i];
			if (n.hq == hq && n.id > max) {
				max = n.id;
				price = n.price;
				item = n.item;
			}
		}
		return price;
	};
	
	var updatePrices = function() {
		$scope.price = getPrice($scope.notes, false);
		$scope.hqprice = getPrice($scope.notes, true);
		Pricer.setPrice($scope.item, $scope.price, false);
		Pricer.setPrice($scope.item, $scope.hqprice, true);
	};
	
	var isFavorite = function(item) {
		return false;
	};
	
	$("#add-price-form").submit(function(e) {
		e.preventDefault();
		var field = $(this).find("#price");
		var price = field.val();
		var integerPrice = parseInt(price);
		if (price != integerPrice) {
			return;
		}
		field.val("");
		$scope.$apply(function() {
			$http.post("/" + board + "/add/" + $scope.item.n, { price: price, hq: $scope.hq }).success(function(data, status) {
				$scope.notes.push(data);
				updatePrices();
			});
		});
	});
	
	var back = function() {
		$scope.$apply(function() {
			$scope.item = null;
		});
	};
	
	$("body").on("keydown", function(e) { if (e.keyCode == 27) { back(); }}).on("click", "#brand", back);
}]);