if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (state, target) {
        var context = this,
        state = state || {},
        target = target || {};

        state.buffer = {};
        state.map = {};

        target.count = function (key) {
            return context.count(key, state);
        };
        target.contains = function (key, range) {
            return context.contains(key, state, range);
        };
        target.write = function (key, data, range) {
            return context.write(key, state, data, range);
        };
        target.read = function (key, range) {
            return context.read(key, state, range);
        };
        target.read_unsafe = function (key, range) {
            return context.read_unsafe(key, state, range);
        };
        target.read_all = function (key) {
            return context.read_all(key, state);
        };
        target.coverage = function (key, range, capacity, count) {
            return context.coverage(key, state, range, capacity, count);
        };

        return target;
    },
    inner_point: function (range, point) {
        return range.from <= point && range.to >= point;
    },
    left_point: function (range, point) {
        return range.from > point;
    },
    right_point: function (range, point) {
        return range.from < point;
    },
    find: function (key, state, point, resolver, startIndex) {
        var index = startIndex || 0,
            range,
            found = false;
        
        if (state.map[key]) {
            while (index < state.map[key].length && !found) {
                range = state.map[key][index];
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
    count: function (key, state) {
        var result = 0,
            index = 0;
        
        if (state.map[key]) {
            for (index = 0; index < state.map[key].length; index++) {
                result += state.map[key][index].to - state.map[key][index].from;
            }
        }

        return result;
    },
    write: function (key, state, data, range) {
        var left = this.find(key, state, range.from, this.inner_point),
            right = this.find(key, state, range.to, this.inner_point),
            insert,
            data_index = 0;

        if (state.map[key] === undefined) {
            state.map[key] = [];
            state.buffer[key] = [];
        }

        if (left.found) {
            if (right.found) {
                state.map[key].splice(left.index - 1, right.index - left.index + 1, { from: left.range.from, to: right.range.to });
            } else {
                state.map[key].splice(left.index - 1, state.map.length - left.index + 1, { from: left.range.from, to: range.to });
            }
        } else {
            if (right.found) {
                state.map[key].splice(0, right.index, { from: range.from, to: right.range.to })
            } else {
                insert = this.find(key, state, range.to, this.left_point);
                if (insert.found) {
                    state.map[key].splice(insert.index - 1, 0, range);
                } else {
                    state.map[key].push(range);
                }
            }
        }

        for (var index = range.from; index < range.to; index++, data_index++) {
            state.buffer[key][index] = data[data_index];
        }
    },
    contains: function (key, state, range) {
        var left = this.find(key, state, range.from, this.inner_point),
            right = this.find(key, state, range.to, this.inner_point);

        return left.found && right.found && (left.index === right.index);
    },
    read_unsafe: function (key, state, range) {
        if (state.buffer[key]) {
            return state.buffer[key].slice(range.from, range.to);
        } else {
            return [];
        }
        
    },
    read_all: function (key, state) {
        return state.buffer[key];
    },
    read: function (key, state, range) {
        var result = {};

        result.found = this.contains(key, state, range);

        if (result.found) {
            result.data = this.read_unsafe(key, state, range);
        }

        return result;
    },
    coverage2: function (key, state, range, capacity, count) {
        var r_step = Math.min(count, range.from + capacity),
            l_step,
            r_c = this.find(key, state, r_step, this.inner_point),
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
            l_c = this.find(key, state, l_step, this.inner_point);

            if (l_c.found) {
                from = l_c.range.to;
            } else {
                from = l_step;
            }
        }

        return { from: from, to: to };
    },
    coverage: function (key, state, range, capacity, count) {
        var left = this.find(key, state, range.from, this.inner_point),
            right = this.find(key, state, range.to, this.inner_point),
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
                result = this.coverage2(key, state, result, capacity, count);
            } else {
                result.to = from + capacity;
            }
        }

        return result;
    }
});