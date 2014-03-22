var filter = require('../../../core/utility/filter').create();

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

buster.testCase("filter", {
    "single result": function() {
        var data = [
            { a: 'ab', b: 'q'},
            { a: 'abc', b: 'cde'},
            { a: 'tbz', b: 'qwp'}
        ],
        result = filter.execute({a: 'abc'}, data);
        
        assert.equals(1, result.length);
        assert.equals('abc', result[0].a);
    },
    "multiple results": function () {
        var data = [
            { a: 'ab', b: 'q'},
            { a: 'abc', b: 'cde'},
            { a: 'tbz', b: 'qwp'}
        ],
        result = filter.execute({a: 'ab'}, data);
        
        assert.equals(2, result.length);
        assert.equals('ab', result[0].a);
        assert.equals('abc', result[1].a);
    },
    "single result by integer": function () {
        var data = [
            { a: 1, b: true },
            { a: 2, b: false },
            { a: 3, b: true }
        ],
        result = filter.execute({a: 1}, data);

        assert.equals(1, result.length);
        assert.equals(1, result[0].a);
    },
    "no results": function () {
        var data = [
            { a: 1, b: true },
            { a: 2, b: false },
            { a: 3, b: true }
        ],
        result = filter.execute({a: 1, b: false}, data);

        assert.equals(0, result.length);
    }
});