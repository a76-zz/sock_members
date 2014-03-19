var storage = require('../../core/storage');
var requestor = require('../../mock/requestor');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

var create_storage = function (buffer, page_size, capacity) {
    return storage.__create({
            requestor: requestor.__create(buffer)
        }).register('members', {
            frame: 1,
            page_size: page_size,
            capacity: capacity,
            sortering: {
                key: "a",
                asc: true,
                value: function (current) {
                    return current[this.key];
                }
            }
        });
};

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
            snapshot,
            storage = create_storage(buffer, 2, 10)
            .on('get_members', function (result) {
                snapshot = result;
            });

        storage.filter('members', {
            a: 3
        });

        assert.equals(1, snapshot.data.length);
        assert.equals(3, snapshot.data[0].a);
    },
    "filter2": function () {
        var buffer = [
                {a: 1},
                {a: 2},
                {a: 3, b: 1},
                {a: 3, b: 2},
                {a: 3, b: 3},
                {a: 6},
                {a: 7},
                {a: 8},
                {a: 9},
                {a: 10}
            ],
            snapshot,
            storage = create_storage(buffer, 2, 2)
            .on('get_members', function (result) {
                snapshot = result;
            });

        storage.filter('members', {
            a: 3
        });

        assert.equals(2, snapshot.data.length);
        assert.equals(3, snapshot.data[0].a);
        assert.equals(3, snapshot.data[1].a);

        assert.equals(0, snapshot.mode);
    },
    "page": function () {
        var buffer = [
                {a: 1},
                {a: 2},
                {a: 3, b: 1},
                {a: 3, b: 2},
                {a: 3, b: 3},
                {a: 6},
                {a: 7},
                {a: 8},
                {a: 9},
                {a: 10}
            ],
            snapshot,
            storage = create_storage(buffer, 2, 10)
            .on('get_members', function (result) {
                snapshot = result;
            });

        storage.filter('members', null);
       

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].a);
        assert.equals(2, snapshot.data[1].a);
        assert.equals(0, snapshot.mode);

        storage.to_page('members', 2);

        console.log(snapshot);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(2, snapshot.data[1].b);
        assert.equals(1, snapshot.mode);
    }


});