/**
 * A simple index that builds a hash using the first 3 letters of every word in
 * an items name, and uses it when searching to quickly narrow the search space.
 */
var ItemIndex = new (function() {
	// public 
	
	this.initialize = function(items) {
		console.log("Initializing item map");
		$.each(items, function(index, item) {
			var words = item.n.split(" ");
			$.each(words, function(word_index, word) {
				var normalized_word = word.toLowerCase();
				if (isStopWord(normalized_word)) {
					return;
				}
				var key = normalized_word.substr(0, KEYSIZE);
				if (map[key] == null) {
					map[key] = [];
				}
				map[key].push(item);
			});
		});
		console.log("Item map initialized");
	};
	
	this.search = function(string) {
		var name = string.toLowerCase();
		var key = string.split(" ")[0].substr(0, KEYSIZE).toLowerCase();
		var bucket = map[key];
		if (typeof bucket === "undefined" || bucket === null) {
			return [];
		}
		var results = [];
		$.each(bucket, function(index, item) {
			if (item.n.toLowerCase().indexOf(name) !== -1) {
				results.push(item);
			}
		});
		return results;
	};
	
	this.test = function() { return map ; };
	
	// private
	
	var isStopWord = function(word) {
		if (STOPWORD_MAP === null) {
			STOPWORD_MAP = {};
			$.each(STOPWORDS, function(index, word) {
				STOPWORD_MAP[word] = true;
			});
		}
		return STOPWORD_MAP[word] !== undefined;
	};
	
	var KEYSIZE = 3;
	var STOPWORDS = ["of"];
	var STOPWORD_MAP = null;
	var map = {};
})();

$(function() { ItemIndex.initialize(items); });
