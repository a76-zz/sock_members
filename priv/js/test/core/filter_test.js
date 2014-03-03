var filter = require('../../core/filter');
var buster = require('/usr/local/lib/node_modules/buster');

var assert = buster.assert;

buster.spec.expose();

buster.testCase("filter test", {
    "filter.and": function() {
        var data = [
            { a: 'ab', b: 'q'},
            { a: 'abc', b: 'cde'},
            { a: 'tbz', b: 'qwp'}
        ];

        var f = filter.__create({
        	filter: { a: 'abc'}
        });

        var r = f.execute(data);
        
        assert.equals(r.length, 1);
        assert.equals(r[0].a, 'abc');

        data = [
            { a: 1, b: true },
            { a: 2, b: false },
            { a: 3, b: true }
        ];

        f = filter.__create({
            filter: { a: 1 }
        });

        r = f.execute(data);

        assert.equals(r.length, 1);
        assert.equals(r[0].a, 1);

        f = filter.__create({
            filter: { a: 1, b: false }
        });

        r = f.execute(data);

        assert.equals(r.length, 0);
  
        r = filter.__create({
           filter: { a: "abc" }
        }).execute([
            { a: "ab" },
            { a: "abc" }
        ]);
    
        assert.equals(r.length, 1);
    }
});