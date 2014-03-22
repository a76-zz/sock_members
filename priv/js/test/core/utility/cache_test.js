var _cache = require('../../../core/utility/cache');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

var key = "members";

buster.testCase("cache", {
    "write single element": function() {
        var cache = _cache.create(),
            result;

        cache.write(key, [1], { from: 0, to: 1 });
        result = cache.read_unsafe(key, { from: 0, to: 1 });

        assert.equals(1, result[0]);
    },
    "write": function() {
        var cache = _cache.create();
        cache.write(key, [7, 8], {from: 7, to: 9});

        var range = cache.read(key, {from: 7, to: 9});

        assert.equals(true, range.found, true);
        assert.equals(7, range.data[0]);
        assert.equals(8, range.data[1]);
    },
    "count": function () {
        var cache = _cache.create();
        cache.write(key, [7, 8], {from: 7, to: 9});

        assert.equals(2, cache.count(key));
    },
    "coverage empty cache": function () {
        var cache = _cache.create(),
            coverage = cache.coverage(key, { from: 0, to: 3 }, 5);
        
        assert.equals(0, coverage.from);
        assert.equals(5, coverage.to);
    },
    "coverage empty cache 2": function() {
        var cache = _cache.create();
            coverage = cache.coverage(key, { from: 0, to: 2 }, 10, 20);

        assert.equals(0, coverage.from);
        assert.equals(10, coverage.to);
    },
    "coverage": function() {
        var cache = _cache.create(),
            coverage;

        cache.write(key, [0, 1, 2, 3], { from: 0, to: 4 });
        coverage = cache.coverage(key, { from: 0, to: 2 }, 10, 20);

        assert.equals(4, coverage.from);
        assert.equals(14, coverage.to);

        coverage = cache.coverage(key, { from: 18, to: 20 }, 10, 20);

        assert.equals(10, coverage.from);
        assert.equals(20, coverage.to);

        coverage = cache.coverage(key, { from: 18, to: 20 }, 20, 20);

        assert.equals(4, coverage.from);
        assert.equals(20, coverage.to);

        coverage = cache.coverage(key, { from: 18, to: 20 }, 40, 20);

        assert.equals(4, coverage.from);
        assert.equals(20, coverage.to);

        cache.write(key, [18, 19], { from: 18, to: 20 });

        coverage = cache.coverage(key, { from: 15, to: 18 }, 10, 20);

        assert.equals(8, coverage.from);
        assert.equals(18, coverage.to);

        coverage = cache.coverage(key, { from: 15, to: 20 }, 10, 20);

        assert.equals(8, coverage.from);
        assert.equals(18, coverage.to);

        coverage = cache.coverage(key, { from: 4, to: 7 }, 10, 20);

        assert.equals(4, coverage.from);
        assert.equals(14, coverage.to);

        cache.write(key, [5, 6], { from: 5, to: 7 });

        coverage = cache.coverage(key, { from: 8, to: 20 }, 10, 20);

        assert.equals(8, coverage.from);
        assert.equals(18, coverage.to);

        coverage = cache.coverage(key, { from: 8, to: 20 }, 11, 20);

        assert.equals(7, coverage.from);
        assert.equals(18, coverage.to);

        coverage = cache.coverage(key, { from: 15, to: 18 }, 10, 20);

        assert.equals(8, coverage.from);
        assert.equals(18, coverage.to);

        coverage = cache.coverage(key, { from: 5, to: 20 }, 10, 20);

        assert.equals(7, coverage.from);
        assert.equals(18, coverage.to);
    }
});