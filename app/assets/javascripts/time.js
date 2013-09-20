// 1379653013050 = 7:30pm
app.controller("TimeController", ["$scope", function($scope) {
	var EORZOROCH = 1379653013050;
	var EORZOROCH_DATE = new Date("2000-01-01 19:30:00");
	var EORZEA_SCALE = 3600 / 175; // 2 minutes 55 seconds per 1 second real time
	
	$scope.date = new Date;
	
	$scope.update = function() {
		var difference = (+new Date) - EORZOROCH;
		$scope.date.setTime(EORZOROCH_DATE.getTime() + EORZEA_SCALE * difference);
	};
	
	$scope.$on("initialize", $scope.update);
	
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
