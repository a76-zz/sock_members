if (typeof define !== 'function') { var define = require('/usr/local/lib/node_modules/amdefine')(module) }

  define({
    __create: function(state, target) {
        var context = this,
            state = state || { buffer: [], map: [] },
            target = target || {};

        target.count = function() {
          return context.count(state);
        };

        target.contains = function(range) {
          return context.contains(state, range);
        };

        target.write = function(data, range) {
          return context.write(state, data, range);
        };

        target.read = function(range) {
          return context.read(state, range);
        };

        target.read_unsafe = function(range) {
          return context.read_unsafe(state, range);
        };

        target.coverage = function(range, capacity, count) {
          return context.coverage(state, range, capacity, count);
        };

        return target;
    },

    inner_point: function(range, point) {
      return range.from <= point && range.to >= point;
    },

    left_point: function(range, point) {
      return range.from > point;
    },

    right_point: function(range, point) {
      return range.from < point;
    },

    find: function(state, point, resolver, startIndex) {
      var index = startIndex || 0,
      range,
      found = false;

      while (index < state.map.length && !found) {
        range = state.map[index];
        found = resolver(range, point);
        index++;
      }

      return {
        found: found,
        index: index,
        range: range
      }
    },

    count: function(state) {
      var result = 0,
      index = 0;

      for (index = 0; index < state.map.length; index++) {
        result += state.map[index].to - state.map[index].from;
      }

      return result;
    },

    write: function(state, data, range) {
      var left = this.find(state, range.from, this.inner_point),
      right = this.find(state, range.to, this.inner_point),
      insert,
      data_index = 0;

      if (left.found) {
        if (right.found) {
          state.map.splice(left.index - 1, right.index - left.index + 1, { from: left.range.from, to: right.range.to });
        }
        else {
          state.map.splice(left.index - 1, state.map.length - left.index + 1, { from: left.range.from, to: range.to });
        }
      }
      else {
        if (right.found) {
          state.map.splice(0, right.index, { from: range.from, to: right.range.to })
        }
        else {
          insert = this.find(state, range.to, this.left_point);
          if (insert.found) {
            state.map.splice(insert.index - 1, 0, range);
          }
          else {
            state.map.push(range);
          }
        }
      }

      for (var index = range.from; index < range.to; index++, data_index++) {
        state.buffer[index] = data[data_index];
      }
    },

    contains: function(state, range) {
      var left = this.find(state, range.from, this.inner_point),
      right = this.find(state, range.to, this.inner_point);

      return left.found && right.found && (left.index === right.index);
    },

    read_unsafe: function(state, range) {
      return state.buffer.slice(range.from, range.to);
    },

    read: function(state, range) {
      var result = {};

      result.found = this.contains(state, range);

      if (result.found) {
        result.data = this.read_unsafe(state, range);
      }

      return result;
    },

    coverage2: function(state, range, capacity, count) {
      var r_step = Math.min(count, range.from + capacity),
      l_step,
      r_c = this.find(state, r_step, this.inner_point),
      l_c,
      to,
      from = range.from;

      if (r_c.found) {
        to = r_c.range.from;
      }
      else {
        to = r_step;
      }

      if (to - from < capacity) {
        l_step = Math.max(0, to - capacity);
        l_c = this.find(state, l_step, this.inner_point);

        if (l_c.found) {
          from = l_c.range.to;
        }
        else {
          from = l_step;
        }
      }

      return { from: from, to: to };
    },

    coverage: function(state, range, capacity, count) {
      var left = this.find(state, range.from, this.inner_point),
      right = this.find(state, range.to, this.inner_point),
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
          result = this.coverage2(state, result, capacity, count);
        } else {
          result.to = from + capacity;
        }
      }

      return result;
    }
  });