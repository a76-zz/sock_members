var storage = require('../../core/storage');
var requestor = require('../../core/requestor');

var sockjs = require('../../mock/sockjs');
var json = require('../../mock/json');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

buster.testCase("storage simple test", {
    "filter": function () {
        var buffer = [
                {a: 1},
                {a: 2},
                {a: 3},
                {a: 4},
                {a: 5},
                {a: 6},
                {a: 7},
                {a: 8},
                {a: 9},
                {a: 10}
            ],
            mock = {
                SockJS: sockjs.__create(buffer),
                JSON: json
            },
            snapshot,
            s = storage.__create({
                requestor: requestor.__create({}, mock)
            }).register('members', {
                frame: 1,
                page_size: 2,
                capacity: 10,
                sortering: {
                    key: "a",
                    asc: true,
                    value: function (current) {
                        return current[this.key];
                    }
                }
            }).on('get_members', function (result) {
                snapshot = result;
            });

        s.filter('members', {
            a: 3
        });

        //console.log(snapshot);

        assert.equals(1, snapshot.data.length);
        assert.equals(3, snapshot.data[0].a);
    }

});