var pager = require('../../../core/utility/pager').create();

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

buster.testCase("pager", {
    "range": function() {
        var range = pager.range(10, 2, 1);
        assert.equals(0, range.from);
        assert.equals(2, range.to);

        range = pager.range(10, 2, 5);
        assert.equals(8, range.from);
        assert.equals(10, range.to);

        range = pager.range(10, 3, 2);
        assert.equals(3, range.from);
        assert.equals(6, range.to);
    }
});