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

            state.emit = function (event) {
                target.emit(event);
            };

            target.register = function (key, settings) {
                context.register(state, key, settings);
                return this;
            };

            target.get_f_mode = function (key, filtering) {
                return context.get_f_mode(state, key, filtering);
            };

            target.to_page = function (key, page) {
                context.to_page(state, key, target, page);
            };

            target.change_page_size = function (key, page_size) {
               context.change_page_size(state, key, page_size);
            };

            target.to_next = function (key) {
                context.to_next(state, key);
            };

            target.to_previous = function (key) {
                context.to_previous(state, key);
            };

            target.sort = function (key, sortering) {
                context.sort(state, key, sortering)
            };

            target.filter = function (key, filtering, f_mode) {
                context.filter(state, key, filtering, f_mode);
            };

            return target;
        },
        register: function (state, key, settings) {
        	var context = this;

            state[key] = {
                frame: settings.frame,
                page: 1,
                page_size: settings.page_size,
                capacity: settings.capacity,
                sortering: settings.sortering
            };

            state.requestor.on('get_' + key, function (e) {
                state[key].total = e.response.total;
                state.cache.write(key, e.response.data, e.request.range);
                state.emit(context.get_snapshot(state, key, 0));
            });
        }, 
        get_range: function (state, key) {
            var context = state[key];
            return state.pager.range(context.total, context.page_size, context.page);
        },
        get_snapshot: function (state, key, mode) {
        	var context = state[key],
                total = mode === 2 ? context.l2cache.length : context.total,
                range = state.pager.range(total, context.page_size, context.page),
                data = mode === 2 ? context.l2cache.slice(range.from, range.to) : state.cache.read_unsafe(key, range);
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
        send_request: function (state, key, range) {
            var context = state[key];
            state.requestor.get({
                key: key,
                filtering: context.filtering,
                sortering: context.sortering,
                range: range
            });
        },
        to_page: function (state, key, page) {
            var context = state[key],
                range;

            context.page = page;

            if (context.l2cache) {
                state.emit(this.get_snapshot(state, key, 2));
            } else {
                range = this.get_range(key, state);
                if (state.cache.contains(key, range)) {
                    state.emit(this.get_snapshot(state, key, 1));
                } else {
                    range = state.cache.coverage(key, range, context.capacity, context.total);
                    this.send_request(state, key, range);
                }
            }
        },
        to_next: function (state, key) {
            var context = state[key];
            this.to_page(state, key, context.page + 1);
        },
        to_previous: function (state, key) {
            var context = state[key];
            this.to_page(state, key, context.page - 1);
        },
        change_page_size: function (state, key, page_size) {
            var context = state[key];
            context.page_size = page_size;
            this.to_page(state, key, 1);
        },
        sort: function (state, key, sortering) {
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
                    // just returns whole cache buffer
                    data = state.cache.read_all(key);
                }

                context.l2cache = context.sorter.execute(context.sortering, data);

                state.emit(this.get_snapshot(state, key));
            } else {
                range = this.get_range(state, key);
                range = state.cache.coverage(key, range, context.capacity, context.total);
                this.send_request(state, key, range);
            }
        },
        get_f_mode: function (state, key, filtering) {
            var context = state[key];
            return context.total && state.cache.contains(key, {from: 0, to: context.total}) && state.comparator.narrower(context.filtering, filtering) ? 2 : 0;
        },
        filter: function (state, key, filtering, f_mode) {
            var context = state[key],
                mode = f_mode || this.get_f_mode(state, key, filtering),
                data;

            context.page = 1;

            if (mode === 2) {
                context.l2filtering = filtering;
                data = state.cache.read_all(key);
                data = state.filter.execute(filtering, data);
                context.l2cache = state.sorter.execute(context.sortering, data);
                
                state.emit(this.get_snapshot(state, key, 2));
            } else {
                context.filtering = filtering;
                state.l2cache = null;

                this.send_request(state, key, {
                    from: 0,
                    to: Math.max(context.capacity, context.page_size)
                });

            }
        }
	};

});

