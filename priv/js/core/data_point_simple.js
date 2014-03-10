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

            state.cache = [];
            state.filter = filter_proto.__create();
            state.sorter = sorter_proto.__create();
            state.comparator = comparator_proto.__create();

            state.requestor.on('get', function (event) {
                state.cache = state.requestor.to_data(event.response).data;
                target.emit(context.c_snapshot(state, 0));
            });

            target.f_mode = function (filtering) {
                return context.f_mode(state, target, filtering);
            };
            target.filter = function (filtering, f_mode) {
                context.filter(state, target, filtering, f_mode);
            };
            target.sort = function (sortering) {
                context.sort(state, target, sorting);
            };

            return target;
        },
        f_mode: function (state, target, filtering) {
            return state.filtering && state.comparator.narrower(state.filtering, filtering) ? 2 : 0;
        },
        filter: function (state, target, filtering, f_mode) {
            var mode = f_mode || this.f_mode(state, target, filtering);
            if (mode === 2) {
                this.l2_filter(state, target, filtering);
            } else {
                this.s_filter(state, target, filtering);
            }
        },
        sort: function (state, target, sortering) {
            var data = state.l2cache || state.cache,
                result;

            state.sortering = sortering;

            if (data) {
                result = state.sorter.execute(sortering, data);

                if (state.l2cache) {
                    state.l2cache = result;
                } else {
                    state.cache = result;
                }
                target.emit(this.c_snapshot(state, 2));
            } else {
                this.s_run(state);
            }
        },
        l2_filter: function (state, target, filtering) {
            var data = state.filter.execute(filtering, state.cache);

            state.l2cache = state.sorter.execute(state.sortering, data);
            state.l2filtering = filtering;

            target.emit(state, 2);
        },
        s_filter: function (state, target, filtering) {
            state.filtering = filtering;

            delete state.cache;
            delete state.l2cache;
            delete state.l2filtering;

            this.s_run(state);
        },
        s_run: function (state) {
            state.requestor.get({
                filtering: state.filtering,
                sortering: state.sortering
            });
        },
        c_snapshot: function (state, mode) {
            return {
                name: 'get',
                sortering: state.sortering,
                filtering: state.l2filtering || state.filtering,
                data: state.l2cache || state.cache,
                mode: mode
            };
        }
    };
});