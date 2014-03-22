var comparator = require('../../../core/utility/comparator').create();

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

var current = {
    a: "ab"
};

buster.testCase("comparator", {
    "narrower positive": function () {
    	var result = comparator.narrower(current, {a: "abc", b: "x"});
        assert.equals(true, result);
    },

    "narrower negative": function () {
        var result = comparator.narrower(current, {a: "a", b: "x"});
        assert.equals(false, result);
    },

    "narrower positive 2": function () {
        var result = comparator.narrower(current, {a: "ab", b: true});
        assert.equals(true, result);
    } 
});