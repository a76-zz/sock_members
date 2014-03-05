if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create:function (state, target) {
        var context = this,
            state = state || { frame: 0, count: function () { return 0; }  },
            target = target || {};

        target.pages = function (page_size, current) {
            return context.pages(state, page_size, current);
        };
        target.page_count = function (page_size) {
            return context.page_count(state, page_size);
        };
        target.data = function (page_size, current) {
            return context.data(state, page_size, current);
        };
        target.range = function (page_size, current) {
            return context.range(state, page_size, current);
        };
        target.contains = function (page_size, current) {
            return context.contains(state, page_size, current);
        };

        return target;
    },
    page_count: function (that, page_size) {
        var count = that.count();
        var remainder = count % page_size;
        var whole = (count - remainder) / page_size;

        return remainder > 0 ? whole + 1 : whole;
    },
    pages: function (that, page_size, current) {
        var result = [],
        left,
        right,
        page_count = this.page_count(that, page_size);

        result.push({
            index: 1,
            active: current == 1
        });

        left = Math.max(current - that.frame, 2);
        right = Math.min(current + that.frame, page_count);

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
    range: function (that, page_size, current) {
        var to = current * page_size,
        count = that.count();

        if (count !== undefined) {
            to = Math.min(current * page_size, count);
        };

        return { from: (current - 1) * page_size, to: to };
    },
    data: function (that, page_size, current) {
        var range = this.range(that, page_size, current);
        return that.read(range);
    },
    contains: function (that, page_size, current) {
        var range = this.range(that, page_size, current);
        return that.contains(range);
    }
});