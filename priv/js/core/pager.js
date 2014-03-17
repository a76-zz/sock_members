if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create:function (state, target) {
        var context = this,
            state = state || { default_frame: 1, frame: {}, count: function (key) { return 0; }  },
            target = target || {};

        target.pages = function (key, page_size, current) {
            return context.pages(key, state, page_size, current);
        };
        target.page_count = function (key, page_size) {
            return context.page_count(key, state, page_size);
        };
        target.data = function (key, page_size, current) {
            return context.data(key, state, page_size, current);
        };
        target.range = function (key, page_size, current) {
            return context.range(key, state, page_size, current);
        };
        target.contains = function (key, page_size, current) {
            return context.contains(key, state, page_size, current);
        };

        return target;
    },
    page_count: function (key, that, page_size) {
        var count = that.count(key);
        var remainder = count % page_size;
        var whole = (count - remainder) / page_size;

        return remainder > 0 ? whole + 1 : whole;
    },
    pages: function (key, that, page_size, current) {
        var result = [],
        left,
        right,
        page_count = this.page_count(key, that, page_size),
        frame = that.frame[key] || default_frame;

        result.push({
            index: 1,
            active: current == 1
        });

        left = Math.max(current - frame, 2);
        right = Math.min(current + frame, page_count);

        if (right >= left) {
            if (left > 2) {
                result.push({
                    splitter: true
                })
            }

            for (var index = left; index <= right; index++) {
                result.push({
                    index: index,
                    active: current == index
                });
            }

            if (right < page_count - 1) {
                result.push({
                    splitter: true
                })
            }
        }

        if (right < page_count) {
            result.push({
                index: page_count,
                active: false
            })
        }

        return result;
    },
    range: function (key, that, page_size, current) {
        var to = current * page_size,
        count = that.count(key);

        if (count !== undefined) {
            to = Math.min(current * page_size, count);
        };

        return { from: (current - 1) * page_size, to: to };
    },
    data: function (key, that, page_size, current) {
        var range = this.range(key, that, page_size, current);
        return that.read(key, range);
    },
    contains: function (key, that, page_size, current) {
        var range = this.range(key, that, page_size, current);
        return that.contains(key, range);
    }
});