if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    create: function () {
        return {
            buffer: {},
            map: {},
            inner_point: function (range, point) {
                return range.from <= point && range.to >= point;
            },
            left_point: function (range, point) {
                return range.from > point;
            },
            right_point: function (range, point) {
                return range.from < point;
            },
            find: function (key, point, resolver, startIndex) {
                var index = startIndex || 0,
                    range,
                    found = false;
                
                if (this.map[key]) {
                    while (index < this.map[key].length && !found) {
                        range = this.map[key][index];
                        found = resolver(range, point);
                        index++;
                    }
                } 

                return {
                    found: found,
                    index: index,
                    range: range
                };
            },
            count: function (key) {
                var result = 0,
                    index = 0;
                
                if (this.map[key]) {
                    for (index = 0; index < this.map[key].length; index++) {
                        result += this.map[key][index].to - this.map[key][index].from;
                    }
                }

                return result;
            },
            write: function (key, data, range) {
                var left = this.find(key, range.from, this.inner_point),
                    right = this.find(key, range.to, this.inner_point),
                    insert,
                    data_index = 0;

                if (this.map[key] === undefined) {
                    this.map[key] = [];
                    this.buffer[key] = [];
                }

                if (left.found) {
                    if (right.found) {
                        this.map[key].splice(left.index - 1, right.index - left.index + 1, { from: left.range.from, to: right.range.to });
                    } else {
                        this.map[key].splice(left.index - 1, this.map.length - left.index + 1, { from: left.range.from, to: range.to });
                    }
                } else {
                    if (right.found) {
                        this.map[key].splice(0, right.index, { from: range.from, to: right.range.to })
                    } else {
                        insert = this.find(key, range.to, this.left_point);
                        if (insert.found) {
                            this.map[key].splice(insert.index - 1, 0, range);
                        } else {
                            this.map[key].push(range);
                        }
                    }
                }

                for (var index = range.from; index < range.to; index++, data_index++) {
                    this.buffer[key][index] = data[data_index];
                }
            },
            contains: function (key, range) {
                var left = this.find(key, range.from, this.inner_point),
                    right = this.find(key, range.to, this.inner_point);

                return left.found && right.found && (left.index === right.index);
            },
            read_unsafe: function (key, range) {
                if (this.buffer[key]) {
                    return this.buffer[key].slice(range.from, range.to);
                } else {
                    return [];
                }
                
            },
            read_all: function (key) {
                return this.buffer[key];
            },
            read: function (key, range) {
                var result = {};

                result.found = this.contains(key, range);

                if (result.found) {
                    result.data = this.read_unsafe(key, range);
                }

                return result;
            },
            coverage2: function (key, range, capacity, count) {
                var r_step = Math.min(count, range.from + capacity),
                    l_step,
                    r_c = this.find(key, r_step, this.inner_point),
                    l_c,
                    to,
                    from = range.from;

                if (r_c.found) {
                    to = r_c.range.from;
                } else {
                    to = r_step;
                }

                if (to - from < capacity) {
                    l_step = Math.max(0, to - capacity);
                    l_c = this.find(key, l_step, this.inner_point);

                    if (l_c.found) {
                        from = l_c.range.to;
                    } else {
                        from = l_step;
                    }
                }

                return { from: from, to: to };
            },
            coverage: function (key, range, capacity, count) {
                var left = this.find(key, range.from, this.inner_point),
                    right = this.find(key, range.to, this.inner_point),
                    from = range.from,
                    to = range.to,
                    result;

                if (left.found) {
                    from = left.range.to;
                }

                if (right.found) {
                    to = right.range.from;
                }

                result = { from: from, to: to };

                if (to - from < capacity) {
                    if (count !== undefined) {
                        result = this.coverage2(key, result, capacity, count);
                    } else {
                        result.to = from + capacity;
                    }
                }

                return result;
            }

        };  
    }
    
});