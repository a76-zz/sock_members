if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var event_proto = require('../core/event'),
        filter_proto = require('../core/filter'),
        comparator_proto = require('../core/comparator'),
        sorter_proto = require('../core/sorter');

    return {
        __create: function (state, target) {
            var context = this,
                state = state || {},
                target = event_proto.__create(state, target || {});

            state.cache = {};
            state.l2cache = {};
            
            state.filtering = {};
            state.l2filtering = {};

            state.sortering = {};

            state.keys = {};

            state.filter = filter_proto.__create();
            state.sorter = sorter_proto.__create();
            state.comparator = comparator_proto.__create();

            target.f_mode = function (key, filtering) {
                return context.f_mode(key, state, target, filtering);
            };
            target.filter = function (key, filtering, f_mode) {
                context.filter(key, state, target, filtering, f_mode);
            };
            target.sort = function (key, sortering) {
                context.sort(key, state, target, sorting);
            };

            return target;
        },
        f_mode: function (key, state, target, filtering) {
            return state.filtering[key] && state.comparator.narrower(state.filtering[key], filtering) ? 2 : 0;
        },
        filter: function (key, state, target, filtering, f_mode) {
            var mode = f_mode || this.f_mode(key, state, target, filtering);
            if (mode === 2) {
                this.l2_filter(key, state, target, filtering);
            } else {
                this.s_filter(key, state, target, filtering);
            }
        },
        sort: function (key, state, target, sortering) {
            var data = state.l2cache[key] || state.cache[key],
                result;

            state.sortering[key] = sortering;

            if (data) {
                result = state.sorter.execute(sortering, data);

                if (state.l2cache[key]) {
                    state.l2cache[key] = result;
                } else {
                    state.cache[key] = result;
                }
                target.emit(this.c_snapshot(key, state, 2));
            } else {
                this.s_run(key, state, target);
            }
        },
        l2_filter: function (key, state, target, filtering) {
            var data = state.filter.execute(filtering, state.cache[key]);

            state.l2cache[key] = state.sorter.execute(state.sortering, data);
            state.l2filtering[key] = filtering;

            target.emit(key, state, 2);
        },
        s_filter: function (key, state, target, filtering) {
            state.filtering[key] = filtering;

            delete state.cache[key];
            delete state.l2cache[key];
            delete state.l2filtering[key];

            this.s_run(key, state, target);
        },
        s_run: function (key, state, target) {
            this.add_callback(key, state, target);

            state.requestor.get({
                key: key,
                filtering: state.filtering[key],
                sortering: state.sortering[key]
            });
        },
        c_snapshot: function (key, state, mode) {
            return {
                name: 'get_' + key,
                sortering: state.sortering[key],
                filtering: state.l2filtering[key] || state.filtering[key],
                data: state.l2cache[key] || state.cache[key],
                mode: mode
            };
        },
        add_callback: function (key, state, target) {
            var context = this;

            if (!state.keys[key]) {
                state.requestor.on('get_' + key, function (event) {
                    state.cache[key] = state.requestor.to_data(event.response).data;
                    target.emit(context.c_snapshot(key, state, 0));
                });

                state.keys[key] = key;
            } 
        }
    };
});