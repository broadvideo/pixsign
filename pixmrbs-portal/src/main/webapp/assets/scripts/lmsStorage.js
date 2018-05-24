var lmsStorage = function() {
	var ls = sessionStorage, lo = ls.getItem("lms") || '{}';
	try {
		lo = JSON.parse(lo);
		lo = Object(lo) === lo ? lo : {};
	} catch(e) {
		lo = {};
	}
	return {
		has: function(attr) {
			return !!lo[attr];
		},
		get: function(attr) {
			return lo[attr];
		},
		set: function(attr, val) {
			lo[attr] = val;
			return this;
		},
		remove: function(attr) {
			delete lo[attr];
			return this;
		},
		clear: function() {
			lo = {};
			return this;
		},
		save: function() {
			if(this.size() > 0) {
				ls.setItem(name, JSON.stringify(lo));
			} else {
				ls.removeItem(name);
			}
			return this;
		},
		size: function() {
			return Object.keys(lo).length;
		},
		toJSON: function() {
			var o = {}, i;
			for(i in lo) {
				o[i] = lo[i];
			}
			return o;
		},
		toString: function() {
			return JSON.stringify(lo);
		}
	};
}();