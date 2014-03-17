var cache = require('../../core/cache');
var pager = require('../../core/pager');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

var key = "members";

buster.testCase("pager test", {
    "pager.pages": function() {
        var e = pager.__create({
            frame: {
                members: 2
            },
            count: function(key) { return 100; }
        });

        var pages = e.pages(key, 5, 1);
        assert.equals(pages.length, 5);

        assert.equals(pages[0].index, 1);
        assert.equals(pages[0].active, true);

        assert.equals(pages[1].index, 2);
        assert.equals(pages[1].active, false);

        assert.equals(pages[2].index, 3);
        assert.equals(pages[2].active, false);

        assert.equals(pages[3].splitter, true);

        assert.equals(pages[4].index, 20);
        assert.equals(pages[4].active, false);

        pages = e.pages(key, 8, 1);
        assert.equals(pages.length, 5);

        assert.equals(pages[4].index, 13);

        pages = e.pages(key, 4, 5);
        assert.equals(pages.length, 9);

        assert.equals(pages[8].index, 25);
        assert.equals(pages[8].active, false);

        assert.equals(pages[7].splitter, true);

        assert.equals(pages[6].index, 7);
        assert.equals(pages[6].active, false);

        assert.equals(pages[5].index, 6);
        assert.equals(pages[5].active, false);

        assert.equals(pages[4].index, 5);
        assert.equals(pages[4].active, true);

        assert.equals(pages[0].index, 1);
        assert.equals(pages[0].active, false);

        assert.equals(pages[1].splitter, true);

        assert.equals(pages[2].index, 3);
        assert.equals(pages[2].active, false);

        pages = e.pages(key, 4, 4);
        assert.equals(pages.length, 8);

        assert.equals(pages[7].index, 25);
        assert.equals(pages[7].active, false);

        assert.equals(pages[0].index, 1);
        assert.equals(pages[1].index, 2);
        assert.equals(pages[2].index, 3);
        assert.equals(pages[3].index, 4);
        assert.equals(pages[3].active, true);
        assert.equals(pages[4].index, 5);
        assert.equals(pages[5].index, 6);

        assert.equals(pages[6].splitter, true);

        pages = e.pages(key, 4, 21);
        assert.equals(pages.length, 9);

        assert.equals(pages[8].index, 25);
        assert.equals(pages[7].splitter, true);
        assert.equals(pages[6].index, 23);
        assert.equals(pages[5].index, 22);
        assert.equals(pages[4].index, 21);
        assert.equals(pages[4].active, true);
        assert.equals(pages[3].index, 20);
        assert.equals(pages[2].index, 19);
        assert.equals(pages[1].splitter, true);
        assert.equals(pages[0].index, 1);

        pages = e.pages(key, 4, 22);
        assert.equals(pages.length, 8);

        assert.equals(pages[7].index, 25);
        assert.equals(pages[6].index, 24);
        assert.equals(pages[5].index, 23);
        assert.equals(pages[4].index, 22);
        assert.equals(pages[3].index, 21);
        assert.equals(pages[2].index, 20);
        assert.equals(pages[1].splitter, true);
        assert.equals(pages[0].index, 1);

        pages = e.pages(key, 4, 23);

        assert.equals(pages.length, 7);
        assert.equals(pages[6].index, 25);
        assert.equals(pages[5].index, 24);
        assert.equals(pages[4].index, 23);
        assert.equals(pages[3].index, 22);
        assert.equals(pages[2].index, 21);
        assert.equals(pages[1].splitter, true);
        assert.equals(pages[0].index, 1);

        pages = e.pages(key, 4, 25);

        assert.equals(pages.length, 5);
        assert.equals(pages[4].index, 25);
        assert.equals(pages[4].active, true);
        assert.equals(pages[3].index, 24);
        assert.equals(pages[2].index, 23);
        assert.equals(pages[1].splitter, true);
        assert.equals(pages[0].index, 1);

        pages = e.pages(key, 4, 1);

        assert.equals(pages.length, 5);
        assert.equals(pages[0].index, 1);
        assert.equals(pages[1].index, 2);
        assert.equals(pages[2].index, 3);
        assert.equals(pages[3].splitter, true);
        assert.equals(pages[4].index, 25);
    },
    "pager.data": function() {
        var e = pager.__create({
            buffer: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            count: function() { return this.buffer.length },
            read: function(key, range) { return this.buffer.slice(range.from, range.to); }
        });

        var page = e.data(key, 2, 1);
        assert.equals(page.length, 2);
        assert.equals(page[0], 1);
        assert.equals(page[1], 2);

        page = e.data(key, 2, 5);
        assert.equals(page.length, 2);
        assert.equals(page[0], 9);
        assert.equals(page[1], 10);

        page = e.data(key, 3, 2);
        assert.equals(page.length, 3);
        assert.equals(page[0], 4);
        assert.equals(page[1], 5);
        assert.equals(page[2], 6);

        page = e.data(key, 3, 4);
        assert.equals(page.length, 1);
        assert.equals(page[0], 10);
    },
    "pager.data2": function() {
        var e = pager.__create({
            buffer: [1],
            count: function() { return this.buffer.length },
            read: function(key, range) { return this.buffer.slice(range.from, range.to); }
        });

        var page = e.data(key, 2, 1);
        assert.equals(page.length, 1);
        assert.equals(page[0], 1);
    },
    "pager.oncache": function() {
        var c = cache.__create();
        c.write(key, [1], { from: 0, to: 1 });

        var e = pager.__create({
            read: c.read_unsafe,
            count: function(key) { return 1; }
        });

        var page = e.data(key, 1, 1);
        var range = e.range(key, 1, 1);
        assert.equals(range.from, 0);
        assert.equals(range.to, 1);

        var data = c.read_unsafe(key, { from: 0, to: 1 });
        assert.equals(data.length, 1);
        assert.equals(data[0], 1);
        assert.equals(page.length, 1);
        assert.equals(page[0], 1);
    }
});