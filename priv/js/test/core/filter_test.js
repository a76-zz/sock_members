var filter = require('../../core/filter');
var buster = require('/usr/local/lib/node_modules/buster');

var assert = buster.assert;

buster.spec.expose();

buster.testCase("filter", {
    "basic": function() {
        var data = [
            { a: 'ab', b: 'q'},
            { a: 'abc', b: 'cde'},
            { a: 'tbz', b: 'qwp'}
        ];

        var f = filter.__create();

        var r = f.execute({a: 'abc'}, data);
        
        assert.equals(r.length, 1);
        assert.equals(r[0].a, 'abc');

        data = [
            { a: 1, b: true },
            { a: 2, b: false },
            { a: 3, b: true }
        ];

        r = f.execute({a: 1}, data);

        assert.equals(r.length, 1);
        assert.equals(r[0].a, 1);

        r = f.execute({ a: 1, b: false }, data);

        assert.equals(r.length, 0);
    }
});