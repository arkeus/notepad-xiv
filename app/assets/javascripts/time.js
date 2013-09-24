// 1379653013050 = 7:30pm
app.controller("TimeController", ["$rootScope", "$scope", function($rootScope, $scope) {
	var EORZOROCH = 1379653013050;
	var EORZOROCH_DATE = new Date("2000-01-01 19:30:00");
	var EORZEA_SCALE = 3600 / 175; // 2 minutes 55 seconds per 1 second real time
	
	$scope.date = new Date("1000-01-01 00:00:00");
	
	$scope.update = function(broadcast) {
		broadcast = typeof broadcast === "undefined" ? true : broadcast;
		var difference = (+new Date) - EORZOROCH;
		var oldTime = $scope.date.getTime();
		var newTime = EORZOROCH_DATE.getTime() + EORZEA_SCALE * difference;
		$scope.date.setTime(newTime);
		if (broadcast) {
			console.info("Broadcasting", oldTime, newTime);
			$rootScope.$broadcast("set-time", oldTime, newTime);
		}
	};
	
	$scope.$on("initialize", function() { $scope.update(false); });
	
	setInterval(function() {
		$scope.$apply(function() {
			$scope.update();
		});
	}, 2916);
}]);

app.filter("timeIconFilter", ["$sce", function($sce) {
	return function(date) {
		var hours = date.getHours();
		var type = hours >= 6 && hours < 18 ? "sun" : "moon";
		return "<i class='icon-" + type + "'></i>";
	};
}]);

app.filter("timeFilter", function() {
	return function(date) {
		if (date.getFullYear() < 2000) {
			return "Loading...";
		}
		
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = "am";
		
		if (hours > 12) {
			hours -= 12;
			ampm = "pm";
		} else if (hours == 0) {
			hours = 12;
		}
		
		minutes = (minutes < 10 ? "0" : "") + minutes;
		return hours + ":" + minutes + ampm;
	};
});
