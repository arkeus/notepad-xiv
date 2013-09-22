app.controller("NotificationsController", ["$scope", function($scope) {
	$scope.notifications = [];
	
	$scope.$on("notify", function(message, notification) {
		console.warn("hmmm", message, notification);
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
	
	module.notify = function(type, data) {
		console.info("Received notification of type " + type, data);
		var notificationData = builders[type].call(this, data);
		$rootScope.$broadcast("notify", notificationData);
	};
	
	$rootScope.$on("initialize", function() {
		//module.notify("simple", { title: "cow", body: "how now" });
		//module.notify("simple", { title: "cow 1", body: "how now" });
		//module.notify("simple", { title: "cow 2", body: "how now" }); 
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
