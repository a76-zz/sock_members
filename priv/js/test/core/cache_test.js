var cache = require('../../core/cache');
var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

buster.testCase("cache test", {
    add1: function() {
        var c = cache.__create();
        c.write([7, 8], {from: 7, to: 9});
        var o = c.read({from: 7, to: 9});

        assert.equals(o.found, true);
        assert.equals(o.data[0], 7);
        assert.equals(o.data[1], 8);
        assert.equals(c.count(), 2);

        c = cache.__create();

        var coverage = c.coverage({ from: 0, to: 3 }, 5);

        assert.equals(coverage.from, 0);
        assert.equals(coverage.to, 5);
    },
    "add2": function() {
        var c = cache.__create();
        c.write([1], { from: 0, to: 1 });
        var o = c.read_unsafe({ from: 0, to: 1 });

        assert.equals(o[0], 1);
    },
    "coverage": function() {
        var c = cache.__create();
        c.write([0, 1, 2, 3], { from: 0, to: 4 });
        var r = c.coverage({ from: 0, to: 2 }, 10, 20);

        assert.equals(r.from, 4);
        assert.equals(r.to, 14);

        r = c.coverage({ from: 18, to: 20 }, 10, 20);

        assert.equals(r.from, 10);
        assert.equals(r.to, 20);

        r = c.coverage({ from: 18, to: 20 }, 20, 20);

        assert.equals(r.from, 4);
        assert.equals(r.to, 20);

        r = c.coverage({ from: 18, to: 20 }, 40, 20);

        assert.equals(r.from, 4);
        assert.equals(r.to, 20);

        c.write([18, 19], { from: 18, to: 20 });

        r = c.coverage({ from: 15, to: 18 }, 10, 20);

        assert.equals(r.from, 8);
        assert.equals(r.to, 18);

        r = c.coverage({ from: 15, to: 20 }, 10, 20);

        assert.equals(r.from, 8);
        assert.equals(r.to, 18);

        r = c.coverage({ from: 4, to: 7 }, 10, 20);

        assert.equals(r.from, 4);
        assert.equals(r.to, 14);

        c.write([5, 6], { from: 5, to: 7 });

        r = c.coverage({ from: 8, to: 20 }, 10, 20);

        assert.equals(r.from, 8);
        assert.equals(r.to, 18);

        r = c.coverage({ from: 8, to: 20 }, 11, 20);

        assert.equals(r.from, 7);
        assert.equals(r.to, 18);

        r = c.coverage({ from: 15, to: 18 }, 10, 20);

        assert.equals(r.from, 8);
        assert.equals(r.to, 18);

        r = c.coverage({ from: 5, to: 20 }, 10, 20);

        assert.equals(r.from, 7);
        assert.equals(r.to, 18);
    },
    "coverage_trivial": function() {
        var c = cache.__create();

        var r = c.coverage({ from: 0, to: 2 }, 10, 20);

        assert.equals(r.from, 0);
        assert.equals(r.to, 10);
    }
});