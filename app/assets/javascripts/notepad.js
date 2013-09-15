var app = angular.module("nixv", ["ngResource", "ngSanitize"]);

//
// APPLICATION
//

app.run(["$rootScope", function($rootScope) {
	
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
	
	module.setPrice = function(item, price) {
		$rootScope.$broadcast("set-price", item, price);
	};
	
	module.removeNote = function(note) {
		$rootScope.$broadcast("remove-note", note);
	};
	
	setTimeout(function() {
		module.remoteSearch(initializationSearch);
	}, 1);
	
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
		template: "<div class='item-result tooltip' data-xivdb='http://xivdb.com/{{item.u}}'><div class='name rarity-{{item.r}}'><span class='price gil' ng-show='item.p'>{{item.p}}<em>G</em></span>{{item.n}}</div><div class='info'><a class='link' href='http://xivdb.com/{{item.u}}' target='_new'>XIVDB</a><span class='level'>Lv<em>{{item.l}}</em></span> | <span class='type'>{{item.t}}</span></div></div>",
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
		template: "<div class='note tooltip' data-xivdb='http://xivdb.com/{{item.u}}'><div class='name rarity-{{item.r}}'><span class='price gil'>{{note.price}}<em>G</em></span>{{item.n}}</div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			scope.item = ItemIndex.get(scope.note.item);
			$(element).click(function() {
				if (confirm("Delete price " + scope.note.price + " for " + scope.item.n + "?")) {
					Notepad.removeNote(scope.note.id);
				}
			});
		}
	};
}]);