app.controller("NotificationsController", ["$scope", function($scope) {
	$scope.notifications = [];
	
	$scope.$on("notify", function(message, notification) {
		$scope.notifications.push(notification);
	});
}]);

app.directive("notification", ["Notepad", function(Notepad) {
	return {
		restrict: "A",
		controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
			$scope.remove = function() {
				$($element).fadeOut(500, function() {
					$scope.$apply(function() {
						$scope.notifications.splice($scope.notifications.indexOf($scope.notification), 1);
						console.info($scope.notifications.length);
					});
				});
			};
		}],
		template: "<div class='notification'><div><div>\
			<div class='title'>{{notification.title}}</div>\
			<div class='body'>{{notification.body}}</div>\
		</div></div></div>",
		replace: true,
		link: function(scope, element, attrs) {
			$(element).click(function() {
				scope.remove();
			});
			setTimeout(function() { scope.remove(); }, 20000);
		}
	};
}]);

app.factory("Notifier", ["$rootScope", function($rootScope) {
	var module = {};
	var gatherData = null;
	
	module.notify = function(type, data) {
		//console.info("Received notification of type " + type, data);
		var notificationData = builders[type].call(this, data);
		$rootScope.$broadcast("notify", notificationData);
	};
	
	$rootScope.$on("initialize", function() {
		gatherData = new GatheringData(gatheringNodes);
		//module.notify("simple", { title: "cow", body: "how now" });
		//module.notify("simple", { title: "cow 1", body: "how now" });
		//module.notify("simple", { title: "cow 2", body: "how now" }); 
	});
	
	$rootScope.$on("set-time", function(message, oldTime, newTime) {
		var oldNormalizedTime = gatherData.normalizeTimestamp(oldTime);
		var newNormalizedTime = gatherData.normalizeTimestamp(newTime);
		var events = gatherData.getInRange(oldNormalizedTime, newNormalizedTime);
		$.each(events, function(index, event) {
			module.notify("gathering", event);
		});
	});
	
	var builders = {
		simple: function(data) {
			return {
				title: data.title,
				body: data.body
			};
		},
		gathering: function(data) {
			return {
				title: data.item,
				subtitle: "Gathering",
				body: "O M G it spawned"
			};
		}
	};
	
	return module;
}]);

var GatheringData = function(nodes) {
	var self = this;
	var data = [];
	
	this.initialize = function(nodes) {
		for (var job in nodes) {
			var jobNodes = nodes[job];
			$.each(jobNodes, function(index, info) {
				data.push(createNotificationEntry(job, info));
			});
		}
	};
	
	this.getInRange = function(before, after) {
		var results = [];
		$.each(data, function(index, info) {
			if (info.time > before && info.time <= after) {
				results.push(info);
			}
		});
		return results;
	};
	
	this.normalizeTime = function(timeString) {
		var times = timeString.split(":");
		return parseInt(times[0]) * 60 + parseInt(times[1]);
	};
	
	this.normalizeTimestamp = function(timestamp) {
		var time = new Date(timestamp);
		return self.normalizeTime(time.getHours() + ":" + time.getMinutes());
	};
	
	var createNotificationEntry = function(job, info) {
		var entry = $.extend({}, info);
		entry.job = job;
		entry.time = self.normalizeTime(entry.time);
		return entry;
	};
	
	this.initialize(nodes);
};
