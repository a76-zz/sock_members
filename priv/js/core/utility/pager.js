if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    create:function () {
        return {
            page_count: function (count, page_size) {
                var remainder = count % page_size;
                var whole = (count - remainder) / page_size;

                return remainder > 0 ? whole + 1 : whole;
            },
            pages: function (count, frame, page_size, current) {
                var result = [],
                left,
                right,
                page_count = this.page_count(count, page_size);

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
            range: function (count, page_size, current) {
                var to = current * page_size;

                if (count !== undefined) {
                    to = Math.min(current * page_size, count);
                };

                return { from: (current - 1) * page_size, to: to };
            }
        };
    }
});