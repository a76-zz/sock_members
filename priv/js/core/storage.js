if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var cache = require('../core/utility/cache'),
        pager = require('../core/utility/pager'),
        filter = require('../core/utility/filter'),
        sorter = require('../core/utility/sorter'),
        comparator = require('../core/utility/comparator');

    return {
        create: function(requestor) {
            return {
                requestor: requestor,
                cache: cache.create(),
                pager: pager.create(),
                _filter: filter.create(),
                sorter: sorter.create(),
                comparator: comparator.create(),
                handlers: {},
                emit: function (event) {
                    var handlers = this.handlers[event.name];

                    if (handlers) {
                        for (var index = 0; index < handlers.length; ++index) {
                           handlers[index](event);
                        }
                    }
                    return this;
                },
                on: function (name, handler) {
                    if (this.handlers[name] === undefined) {
                        this.handlers[name] = [];
                    }

                    this.handlers[name].push(handler);
                    return this;
                },
                register: function (key, settings) {
                    var context = this;

                    this[key] = {
                        frame: settings.frame,
                        page: 1,
                        page_size: settings.page_size,
                        capacity: settings.capacity,
                        sortering: settings.sortering
                    };

                    this.requestor.on('get_' + key, function (e) {
                        context[key].total = e.response.total;
                        if (e.request.range) {
                            context.cache.write(key, e.response.data, e.request.range);
                        } else {
                            context.cache.write(key, e.response.data, {from: 0, to: e.response.total});
                        }
                        context.emit(context.get_snapshot(key, 0));
                    });

                    return this;
                }, 
                get_range: function (key) {
                    var context = this[key];
                    return this.pager.range(context.total, context.page_size, context.page);
                },
                get_snapshot: function (key, mode) {
                    var context = this[key],
                        total = mode === 2 ? context.l2cache.length : context.total,
                        range = this.pager.range(total, context.page_size, context.page),
                        filtering = mode === 2 ? context.l2filtering : context.filtering,
                        data = mode === 2 ? context.l2cache.slice(range.from, range.to) : this.cache.read_unsafe(key, range);
                        
                    return {
                        name: 'get_' + key,
                        key: key,
                        mode: mode,
                        filtering: filtering,
                        sortering: {
                            asc: context.sortering.asc,
                            key: context.sortering.key
                        },
                        page: context.page,
                        page_size: context.page_size,
                        page_count: this.pager.page_count(total, context.page_size),
                        range: range,
                        total: total,
                        data: data,
                        pages: this.pager.pages(total, context.frame, context.page_size, context.page)
                    };
                },
                send_request: function (key, range) {
                    var context = this[key];
                    this.requestor.get({
                        key: key,
                        filtering: context.filtering,
                        sortering: context.sortering,
                        range: range
                    });
                },
                to_page: function (key, page) {
                    var context = this[key],
                        range;

                    context.page = page;

                    if (context.l2cache) {
                        this.emit(this.get_snapshot(key, 2));
                    } else {
                        range = this.get_range(key);
                        if (this.cache.contains(key, range)) {
                            this.emit(this.get_snapshot(key, 1));
                        } else {
                            range = this.cache.coverage(key, range, context.capacity, context.total);
                            this.send_request(key, range);
                        }
                    }
                },
                to_next: function (key) {
                    var context = this[key];
                    this.to_page(key, context.page + 1);
                },
                to_previous: function (key) {
                    var context = this[key];
                    this.to_page(key, context.page - 1);
                },
                change_page_size: function (key, page_size) {
                    var context = this[key];
                    context.page_size = page_size;
                    this.to_page(key, 1);
                },
                sort: function (key, sortering) {
                    var context = this[key],
                        data,
                        range;

                    context.sortering.key = sortering.key;
                    context.sortering.asc = sortering.asc;

                    if (context.total && this.cache.contains(key, {from: 0, to: context.total})) {
                        // cache is whole
                        if (context.l2cache) {
                            data = context.l2cache;
                        } else {
                            // just returns whole cache buffer
                            data = this.cache.read_all(key);
                        }

                        context.l2cache = this.sorter.execute(context.sortering, data);

                        this.emit(this.get_snapshot(key));
                    } else {
                        range = this.get_range(key);
                        range = this.cache.coverage(key, range, context.capacity, context.total);
                        this.send_request(key, range);
                    }
                },
                get_f_mode: function (key, filtering) {
                    var context = this[key];
                    return context.total && this.cache.contains(key, {from: 0, to: context.total}) && this.comparator.narrower(context.filtering, filtering) ? 2 : 0;
                },
                filter: function (key, filtering, f_mode) {
                    var context = this[key],
                        mode = f_mode || this.get_f_mode(key, filtering),
                        data,
                        range;

                    context.page = 1;

                    if (mode === 2) {
                        context.l2filtering = filtering;
                        data = this.cache.read_all(key);
                        context.l2cache = this._filter.execute(filtering, data);
                        context.l2cache = this.sorter.execute(context.sortering, context.l2cache);
                        
                        this.emit(this.get_snapshot(key, 2));
                    } else {
                        context.filtering = filtering;
                        this.l2cache = null;

                        if (context.capacity) {
                            range = {
                                from: 0,
                                to: Math.max(context.capacity, context.page_size)
                            }
                        }

                        this.send_request(key, range);
                    }
                }
            };    
        }    
    };
});

