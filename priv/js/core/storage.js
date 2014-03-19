if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var e = require('../core/event'),
        cache = require('../core/cache'),
        pager = require('../core/pager'),
        filter = require('../core/filter'),
        sorter = require('../core/sorter'),
        comparator = require('../core/comparator');

	return {
        __create: function (state, target) {
            var context = this,
                state = state || {},
                target = e.__create(state, target || {});
            
            state.cache = cache.__create();
            state.pager = pager.__create();
            state.filter = filter.__create();
            state.sorter = sorter.__create();
            state.comparator = comparator.__create();

            target.init = function (key, page_size, frame, capacity, sortering) {
                context.init(key, state, target, page_size, frame, capacity, sortering);
            };

            target.to_page = function (key, page) {
                context.to_page(key, state, target, page);
            };
            target.to_next = function (key) {
                context.to_next(key, state, target);
            };

            target.to_previous = function (key) {
                context.to_previous(key, state, target);
            };

            target.p_size = function (key, page_size) {
               context.p_size(key, state, target, page_size);
            };

            target.sort = function (key, sortering) {
                context.sort(key, state, target, sortering)
            };

            target.f_mode = function (key, filtering) {
                return context.f_mode(key, state, target, filtering);
            };

            target.filter = function (key, filtering, f_mode) {
                context.filter(key, state, target, filtering, f_mode);
            };

            return target;
        },
        init: function (key, state, target, page_size, frame, capacity, sortering) {
        	var context = this;

            state[key] = {
                frame: frame,
                page: 1,
                page_size: page_size,
                capacity: capacity,
                sortering: sortering
            };

            state.requestor.on('get_' + key, function (e) {
                state[key].total = e.response.total;
                state.cache.write(key, e.response.data, e.request.range);
                target.emit(context.get_snapshot(key, state, 0));
            });
        }, 
        get_total: function (key, state, mode) {
            var context = state[key];
            return mode === 2 ? context.l2cache.length : context.total;
        },
        read: function (key, state, range, mode) {
            var context = state[key];
            return mode === 2 ? context.l2cache.slice(range.from, range.to) : state.cache.read(key, range);
        },
        get_range: function (key, state) {
            var context = state[key];
            return state.pager.range(context.total, context.page_size, context.page);
        },
        get_snapshot: function (key, state, mode) {
        	var context = state[key],
                total = this.get_total(key, state, mode),
                range = state.pager.range(total, context.page_size, context.page),
                data = this.read(key, state, range, mode);
            return {
                name: 'get_' + key,
                key: key,
                mode: mode,
                filtering: mode === 2 ? context.l2filtering : context.filtering,
                page: context.page,
                page_size: context.page_size,
                page_count: state.pager.page_count(total, context.page_size),
                range: range,
                total: total,
                data: data,
                pages: state.pager.pages(total, context.frame, context.page_size, context.page)
            };
        },
        send_request: function (key, state, target, range) {
            var context = state[key];
            state.requestor.get({
                key: key,
                filtering: context.filtering,
                sortering: context.sortering,
                range: range,
            });
        },
        to_page: function (key, state, target, page) {
            var context = state[key],
                range;

            context.page = page;

            if (context.l2cache) {
                target.emit(this.get_snapshot(key, state, 2));
            } else {
                range = this.get_range(key, state);
                if (state.cache.contains(key, range)) {
                    target.emit(this.get_snapshot(key, state, 1));
                } else {
                    range = state.cache.coverage(key, range, context.capacity, context.total);
                    this.send_request(key, state, target, range);
                }
            }
        },
        to_next: function (key, state, target) {
            var context = state[key];
            this.to_page(key, state, target, context.page + 1);
        },
        to_previous: function (key, state, target) {
            var context = state[key];
            this.to_page(key, state, target, context.page - 1);
        },
        p_size: function (key, state, target, page_size) {
            var context = state[key];
            context.page_size = page_size;
            this.to_page(key, state, target, 1);
        },
        sort: function (key, state, target, sortering) {
            var context = state[key],
                data,
                range;

            context.sortering.key = sortering.key;
            context.sortering.asc = sortering.asc;

            if (context.total && state.cache.contains(key, {from: 0, to: context.total})) {
                // cache is whole
                if (context.l2cache) {
                    data = context.l2cache;
                } else {
                    data = state.cache.read_unsafe({from: 0, to: context.total});
                }

                context.l2cache = context.sorter.execute(context.sortering, data);

                target.emit(this.get_snapshot(key, state, target));
            } else {
                range = this.get_range(key, state);
                range = state.cache.coverage(key, range, context.capacity, context.total);
                this.send_request(key, state, target, range);
            }
        },
        f_mode: function (key, state, filtering) {
            var context = state[key];
            return context.total && state.cache.contains(key, {from: 0, to: context.total}) && state.comparator.narrower(context.filtering, filtering) ? 2 : 0;
        },
        filter: function (key, state, target, filtering, f_mode) {
            var context = state[key],
                mode = f_mode || this.f_mode(key, state, filtering),
                data;

            context.page = 1;

            if (mode === 2) {
                context.l2filtering = filtering;
                data = state.cache.read_unsafe(key, {from: 0, to: that.total});
                data = state.filter.execute(filtering, data);
                context.l2cache = state.sorter.execute(context.sortering, data);
                
                target.emit(this.get_snapshot(key, state, 2));
            } else {
                context.filtering = filtering;
                state.l2cache = null;

                this.send_request(key, state, target, {
                    from: 0,
                    to: Math.max(context.capacity, context.page_size)
                });

            }
        }
	};

});

