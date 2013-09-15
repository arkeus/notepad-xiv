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
		console.log("notepad selecting item", item);
		$rootScope.$broadcast("select-item", item);
	};
	
	setTimeout(function() {
		module.remoteSearch(initializationSearch);
	}, 1);
	
	return module;
}]);

//
// DIRECTIVES
//

app.directive("itemResult", ["Notepad", function(Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			
		}],
		template: "<div class='item-result tooltip' data-xivdb='http://xivdb.com/{{item.u}}'><div class='name rarity-{{item.r}}'>{{item.n}}</div><div class='info'><a class='link' href='http://xivdb.com/{{item.u}}' target='_new'>XIVDB</a><span class='level'>Lv<em>{{item.l}}</em></span> | <span class='type'>{{item.t}}</span></div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).click(function() {
				console.log("selecting", scope.item);
				Notepad.selectItem(scope.item);
			});
		}
	};
}]);