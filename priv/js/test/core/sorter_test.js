var sorter = require('../../core/sorter');
var buster = require('/usr/local/lib/node_modules/buster');

var assert = buster.assert;

buster.spec.expose();

buster.testCase("sorter test", {
    "sorter": function () {
        var data = [
            { a: "a", n: "a" },
            { a: "b", n: "b" },
            { a: "c", n: "c" }
        ];

        var sortering = {
            key: "a",
            network_key: "n",
            asc: true,
            value: function (current) {
            	return current[this.key] + (current[this.network_key].charCodeAt(0) - 97) / 10;
            }
        };

        var s = sorter.__create();    
        var r = s.execute(sortering, data);
        assert.equals(r[0].a, "a");

        sortering.asc = false;

        r = s.execute(sortering, data);
        assert.equals(r[0].a, "c");

        data = [
        	{a: "a", n: "b"},
        	{a: "a", n: "a"},
        	{a: "b", n: "a"}
        ];
        sortering.asc = true;

        
        r = s.execute(sortering, data);
        assert.equals(r[0].a, "a");
        assert.equals(r[0].n, "a");

        sortering.asc = false;
        sortering.value = function (current) {
            return current[this.key] + (100 - current[this.network_key].charCodeAt(0)) / 10;
        };

        r = s.execute(sortering, data);
        assert.equals(r[0].a, "b");
        assert.equals(r[1].n, "a");
    }/*,
    "position": function () {
        var data = [
            { a: "a", n: "a" },
            { a: "b", n: "b" },
            { a: "d", n: "c" }
        ];

        var sorter = {
            key: "a",
            asc: true,
            value: function (current) {
                return current[this.key];
            }
        };

        var s = sorter.__create();
        var position = s.position(sorter, data, { a: "c", n: "z"});

        assert.equals(position, 2);

        position = s.position(sorter, data, { a: "z", n: "u"});

        assert.equals(position, 3);

        position = s.position(sorter, data, {a: "1", n: "w"});

        assert.equals(position, 0);
    }*/
});