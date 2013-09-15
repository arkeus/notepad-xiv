app.controller("NoteController", ["$scope", "$http", "Notepad", "Note", function($scope, $http, Notepad, Note) {
	$scope.item = null;
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
		$scope.notes = Note.list({ item: item.n });
	});
	
	$scope.$on("remove-note", function(message, note) {
		$scope.$apply(function() {
			$scope.removeNote($scope.notes, note);
			$scope.removeNote($scope.recentNotes, note);
			
			var max = 0, price = null, item = null;
			for (var i = 0; i < $scope.notes.length; i++) {
				var n = $scope.notes[i];
				console.warn(n.id, max, price, n.price);
				if (n.id > max) {
					max = n.id;
					price = n.price;
					item = n.item;
				}
			}
			
			if (price != null) {
				Notepad.setPrice({ n: item }, price);
			}
				
			$http.post("/" + board + "/remove", { note: note }).success(function(data, response) {
				
			});
		});
	});
	
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
			Notepad.setPrice($scope.item, price);
			$http.post("/" + board + "/add/" + $scope.item.n, { price: price }).success(function(data, status) {
				$scope.notes.push(data);
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