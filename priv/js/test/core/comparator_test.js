var comparator = require('../../core/comparator');
var buster = require('/usr/local/lib/node_modules/buster');

var assert = buster.assert;

buster.spec.expose();

buster.testCase("comparator test", {
    "comparator": function () {
    	var c = comparator.__create();

        var current = {
            a: "ab"
        };

    	var r = c.narrower(current, {
    		a: "abc", 
    		b: "x"
    	});

    	assert.equals(r, true);

    	r = c.narrower(current, {
    		a: "a",
    		b: "x"
    	});

    	assert.equals(r, false);

    	r = c.narrower(current, {
    		a: "ab",
    		b: true
    	});

    	assert.equals(r, true);
    }  
});