var cache = require('../../core/cache');
var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

buster.testCase("cache test", {
	add1: function() {
		var c = cache.__extend();
		c.write([7, 8], {from: 7, to: 9});
		var o = c.read({from: 7, to: 9});

		assert.equals(o.found, true);
		assert.equals(o.data[0], 7);
		assert.equals(o.data[1], 8);
		assert.equals(c.count(), 2);
	}
});