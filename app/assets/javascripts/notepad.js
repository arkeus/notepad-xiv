var app = angular.module("nixv", ["ngResource", "ngSanitize"]);

//
// APPLICATION
//

app.run(["$rootScope", function($rootScope) {
	setTimeout(function() {
		$rootScope.$broadcast("initialize");
	}, 50);
}]);

//
// SERVICES
//

app.factory("Notepad", ["$rootScope", function($rootScope) {
	var module = {};
	
	module.search = function(search) {
		
	};
	
	module.remoteSearch = function(value) {
		$rootScope.$broadcast("remote-search", value);
	};
	
	module.selectItem = function(item) {
		$rootScope.$broadcast("select-item", item);
	};
	
	module.removeNote = function(note) {
		$rootScope.$broadcast("remove-note", note);
	};
	
	setTimeout(function() {
		//module.remoteSearch(initializationSearch);
	}, 1);
	
	return module;
}]);

app.factory("Pricer", ["$rootScope", function($rootScope) {
	var module = {};
	var prices = {};
	var hqprices = {};
	
	module.setPrice = function(item, price, hq) {
		hq = hq || false;
		(hq ? hqprices : prices)[item.n] = price;
		$rootScope.$broadcast("set-price", item, price, hq);
	};
	
	module.getPrice = function(item, hq) {
		hq = hq || false;
		return (hq ? hqprices : prices)[item.n];
	};
	
	return module;
}]);

app.factory("Favoriter", ["$rootScope", "Pricer", function($rootScope, Pricer) {
	var LIMIT = 34;
	
	var module = {};
	module.favorites = [];
	
	module.addFavorite = function(item) {
		var favorite = $.extend({}, item);
		delete favorite.$$hashKey;
		
		if (module.isFavorite(favorite) || module.favorites.length >= LIMIT) {
			return;
		}
		
		favorite.p = Pricer.getPrice(favorite);
		module.favorites.unshift(favorite);
		save();
	};
	
	module.removeFavorite = function(item) {
		for (var i = 0; i < module.favorites.length; i++) {
			var favoriteCheck = module.favorites[i];
			if (favoriteCheck.n == item.n) {
				module.favorites.splice(i, 1);
				break;
			}
		}
		save();
	};
	
	module.isFavorite = function(item) {
		for (var i = 0; i < module.favorites.length; i++) {
			var favoriteCheck = module.favorites[i];
			if (favoriteCheck.n == item.n) {
				return true;
			}
		}
		return false;
	};
	
	module.setPrice = function(item, price, hq) {
		$.each(module.favorites, function(index, favorite) {
			if (favorite.n == item.n) {
				if (hq) {
					favorite.hqp = price;
				} else {
					favorite.p = price;
				}
			}
		});
		save();
	};
	
	$rootScope.$on("initialize", function() {
		$rootScope.$apply(function() {
			load();
		});
	});
	
	var save = function() {
		localStorage.setObject("nxiv.favorites." + board, module.favorites);
	};
	
	var load = function() {
		var loaded = localStorage.getObject("nxiv.favorites." + board);
		if (typeof loaded !== "undefined" && loaded != null && loaded.length > 0) {
			for (var i = 0; i < loaded.length; i++) {
				module.favorites.push(loaded[i]);
			}
		}
	};
	
	return module;
}]);

app.factory("Note", ["$rootScope", "$resource", function($rootScope, $resource) {
	return $resource("/:board/:action/:item", { board: board }, {
		list: { method: "GET", params: { action: "list" }, isArray: true },
		recent: { method: "GET", params: { action: "recent" }, isArray: true }
	});
}]);

//
// DIRECTIVES
//

app.directive("itemResult", ["Notepad", function(Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class='item-result tooltip' data-xivdb='http://xivdb.com/{{item.u}}'>\
			<div class='image'><img ng-src='assets/items/{{item.i}}.png'></div>\
			<div class='name rarity-{{item.r}}'><span class='price gil' ng-show='item.p'>{{item.p}}<em>G</em></span>{{item.n}}</div>\
			<div class='info'><a class='link' href='http://xivdb.com/{{item.u}}' target='_new'>XIVDB</a>\
			<span class='level'>Lv<em>{{item.l}}</em></span> | <span class='type'>{{item.t}}</span></div>\
		</div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).click(function() {
				Notepad.selectItem(scope.item);
			});
		}
	};
}]);

app.directive("note", ["$http", "Notepad", function($http, Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class='note tooltip' data-xivdb='http://xivdb.com/{{item.u}}'>\
			<div class='name rarity-{{item.r}}'><img ng-src='assets/items/{{item.i}}.png' class='item-image'> {{item.n}}</div>\
			<div class='price gil'><img src='assets/hq.png' ng-show='{{note.hq}}' class='hq-price-icon'>{{note.price}}<em>G</em></div>\
			<div class='date'>{{note.created_at}}</div>\
		</div>",
		replace: true,
		link: function(scope, element, attrs) {
			scope.item = ItemIndex.get(scope.note.item);
			$(element).click(function() {
				if (attrs['delete']) {
					if (confirm("Delete price " + scope.note.price + " for " + scope.item.n + "?")) {
						Notepad.removeNote(scope.note.id);
					}
				} else {
					Notepad.selectItem(scope.item);
				}
			});
		}
	};
}]);

app.directive("recentItem", ["Notepad", function(Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class='recent-item tooltip' data-xivdb='http://xivdb.com/{{item.u}}'><div class='name rarity-{{item.r}}'>\
			<span class='price gil'><span ng-show='item.p'>{{item.p}}<em>G</em></span><strong ng-show='item.p && item.hqp'>|</strong><span ng-show='item.hqp'><img src='assets/hq.png' class='hq-price-icon'>{{item.hqp}}<em>G</em></span></span>\
			<img ng-src='assets/items/{{item.i}}.png' class='item-image'> {{item.n}}\
		</div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).click(function() {
				Notepad.selectItem(scope.item);
			});
		}
	};
}]);

app.directive("favoriteItem", ["Notepad", function(Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class='favorite-container'><div class='favorite-item tooltip' data-xivdb='http://xivdb.com/{{item.u}}'>\
			<span class='price gil'><span ng-show='item.p'>{{item.p}}<em>G</em></span><strong ng-show='item.p && item.hqp'>|</strong><span ng-show='item.hqp'><img src='assets/hq.png' class='hq-price-icon'>{{item.hqp}}<em>G</em></span></span>\
			<img ng-src='assets/items/{{item.i}}.png' class='item-image'>\
		</div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).click(function() {
				Notepad.selectItem(scope.item);
			});
		}
	};
}]);
