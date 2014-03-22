var sorter = require('../../../core/utility/sorter').create();

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

buster.testCase("sorter", {
    "sort asc": function () { 
        var data = [
            { a: "a", n: "a" },
            { a: "b", n: "b" },
            { a: "c", n: "c" }
        ],
        sortering = {
            key: "a",
            asc: true,
            network_key: "n",
            value: function (current) {
                return current[this.key] + (current[this.network_key].charCodeAt(0) - 97) / 10;
            }
        },
        result = sorter.execute(sortering, data);

        assert.equals("a", result[0].a);
    },
    "sort desc": function () {
        var data = [
            { a: "a", n: "a" },
            { a: "b", n: "b" },
            { a: "c", n: "c" }
        ],
        sortering = {
            key: "a",
            asc: false,
            network_key: "n",
            value: function (current) {
                return current[this.key] + (current[this.network_key].charCodeAt(0) - 97) / 10;
            }
        },
        result = sorter.execute(sortering, data);
        
        assert.equals("c", result[0].a);
    },
    "sort asc by secondary key": function () {
        var data = [
            {a: "a", n: "b"},
            {a: "a", n: "a"},
            {a: "b", n: "a"}
        ],
        sortering = {
            key: "a",
            asc: true,
            network_key: "n",
            value: function (current) {
                return current[this.key] + (current[this.network_key].charCodeAt(0) - 97) / 10;
            }
        },
        result = sorter.execute(sortering, data);

        assert.equals("a", result[0].a);
        assert.equals("a", result[0].n);
    },
    "sort desc by secondary key": function () {
        var data = [
            {a: "a", n: "b"},
            {a: "a", n: "a"},
            {a: "b", n: "a"}
        ],
        sortering = {
            key: "a",
            asc: false,
            network_key: "n",
            value: function (current) {
                return current[this.key] + (100 - current[this.network_key].charCodeAt(0)) / 10;
            }
        },
        result = sorter.execute(sortering, data);

        assert.equals("b", result[0].a);
        assert.equals("a", result[1].n);

    } 
});