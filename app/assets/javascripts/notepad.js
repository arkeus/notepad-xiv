var app = angular.module("nixv", ["ngResource", "ngSanitize"]);

//
// APPLICATION
//

app.run(["$rootScope", function($rootScope) {
	console.log("We've loaded");
}]);

//
// SERVICES
//

app.factory("Notepad", ["$rootScope", function($rootScope) {
	var module = {};
	
	module.search = function(search) {
		
	};
	
	module.testinit = function() {
		$rootScope.$broadcast("remote-search", "sha");
	};
	
	setTimeout(module.testinit, 200);
	
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
		template: "<div class='item-result tooltip' data-xivdb='http://xivdb.com/{{item.u}}'><div class='name rarity-{{item.r}}'>{{item.n}}</div><div class='info'><a class='link' href='http://xivdb.com/{{item.u}}'>XIVDB</a><span class='level'>Lv<em>{{item.l}}<em></span> | <span class='type'>{{item.t}}</span></div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			
		}
	};
}]);