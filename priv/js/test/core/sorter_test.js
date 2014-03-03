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

        var definition = {
            key: "a",
            network_key: "n",
            asc: true,
            value: function (current) {
            	return current[this.key] + (current[this.network_key].charCodeAt(0) - 97) / 10;
            }
        };

        var s = sorter.__create(definition);    
        var r = s.execute(data);
        assert.equals(r[0].a, "a");

        definition.asc = false;

        s = sorter.__create(definition);
        r = s.execute(data);
        assert.equals(r[0].a, "c");

        data = [
        	{a: "a", n: "b"},
        	{a: "a", n: "a"},
        	{a: "b", n: "a"}
        ];
        definition.asc = true;

        s = sorter.__create(definition);
        r = s.execute(data);
        assert.equals(r[0].a, "a");
        assert.equals(r[0].n, "a");

        definition.asc = false;
        definition.value = function (current) {
            return current[this.key] + (100 - current[this.network_key].charCodeAt(0)) / 10;
        };

        s = sorter.__create(definition);
        r = s.execute(data);
        assert.equals(r[0].a, "b");
        assert.equals(r[1].n, "a");
    }
});