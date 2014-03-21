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

buster.testCase("storage", {
    "single item filtering": function () {
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
    "several items filtering": function () {
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
    "paging over the whole cache": function () {
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

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(2, snapshot.data[1].b);
        assert.equals(1, snapshot.mode);

        storage.to_page('members', 5);

        assert.equals(2, snapshot.data.length);
        assert.equals(9, snapshot.data[0].a);
        assert.equals(10, snapshot.data[1].a);
        assert.equals(1, snapshot.mode);
        assert.equals(8, snapshot.range.from);
        assert.equals(10, snapshot.range.to);
    },
    "paging over the partial cache": function () {
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
            storage = create_storage(buffer, 2, 4)
            .on('get_members', function (result) {
                snapshot = result;
            }); 

        storage.filter('members', null);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].a);
        assert.equals(2, snapshot.data[1].a);
        assert.equals(0, snapshot.mode);

        storage.to_page('members', 2);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(2, snapshot.data[1].b);
        assert.equals(1, snapshot.mode);
        
        // go to the page wich is absent in the cache. 
        storage.to_page('members', 5);

        assert.equals(2, snapshot.data.length);
        assert.equals(9, snapshot.data[0].a);
        assert.equals(10, snapshot.data[1].a);
        assert.equals(0, snapshot.mode);
        assert.equals(8, snapshot.range.from);
        assert.equals(10, snapshot.range.to);
        
        // go to the previous page which should be it the cache 
        // because capacity = 4

        storage.to_page('members', 4);
        
        assert.equals(2, snapshot.data.length);
        assert.equals(7, snapshot.data[0].a);
        assert.equals(8, snapshot.data[1].a);
        assert.equals(1, snapshot.mode); // cache was used request was not sent
        assert.equals(6, snapshot.range.from);
        assert.equals(8, snapshot.range.to);

        storage.to_page('members', 3);
        
        assert.equals(2, snapshot.data.length);
        assert.equals(3, snapshot.data[0].b);
        assert.equals(6, snapshot.data[1].a);
        assert.equals(0, snapshot.mode); // cache was not used
        assert.equals(4, snapshot.range.from);
        assert.equals(6, snapshot.range.to);
    },
    "narrow filtering": function () {
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
        
        // recieve all data because capacity = 10
        // as a result our cache is full.
        storage.filter('members', null);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].a);
        assert.equals(2, snapshot.data[1].a);
        assert.equals(0, snapshot.mode);

        // filtering is narrower than initial which was null 
        storage.filter('members', {a: 3});

        // l2cache was created based on the base cache
        // request was not send filtering was performed on the client side
        assert.equals(2, snapshot.mode);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(2, snapshot.data[1].b);
        assert.equals(0, snapshot.range.from);
        assert.equals(2, snapshot.range.to);

        assert.equals(3, snapshot.total);
        storage.to_page('members', 2);
        
        // ensure that paging works correctly
        assert.equals(2, snapshot.mode);

        assert.equals(1, snapshot.data.length);
        assert.equals(3, snapshot.data[0].b);
        assert.equals(2, snapshot.range.from);
        assert.equals(3, snapshot.range.to);

        storage.filter('members', {b: 1});

        // filtering was performed on the client side
        assert.equals(2, snapshot.mode);

        assert.equals(1, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(3, snapshot.data[0].a);
    },
    "narrow filtering not defined capacity": function () {
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
            storage = create_storage(buffer, 2, null) // capacity is not defined
            .on('get_members', function (result) {
                snapshot = result;
            }); 
        
        // recieve all data because capacity = 10
        // as a result our cache is full.
        storage.filter('members', null);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].a);
        assert.equals(2, snapshot.data[1].a);
        assert.equals(0, snapshot.mode);

        // filtering is narrower than initial which was null 
        storage.filter('members', {a: 3});

        // l2cache was created based on the base cache
        // request was not send filtering was performed on the client side
        assert.equals(2, snapshot.mode);

        assert.equals(2, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(2, snapshot.data[1].b);
        assert.equals(0, snapshot.range.from);
        assert.equals(2, snapshot.range.to);

        assert.equals(3, snapshot.total);
        storage.to_page('members', 2);
        
        // ensure that paging works correctly
        assert.equals(2, snapshot.mode);

        assert.equals(1, snapshot.data.length);
        assert.equals(3, snapshot.data[0].b);
        assert.equals(2, snapshot.range.from);
        assert.equals(3, snapshot.range.to);

        storage.filter('members', {b: 1});

        // filtering was performed on the client side
        assert.equals(2, snapshot.mode);

        assert.equals(1, snapshot.data.length);
        assert.equals(1, snapshot.data[0].b);
        assert.equals(3, snapshot.data[0].a);
    },
    "sorting": function () {
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
            storage = create_storage(buffer, 2, null) // capacity is not defined
            .on('get_members', function (result) {
                snapshot = result;
            }); 

        storage.sort('members', {asc: false, key: 'a'});

        assert.equals(2, snapshot.data.length);
        assert.equals(10, snapshot.data[0].a);
        assert.equals(9, snapshot.data[1].a);
    }
});