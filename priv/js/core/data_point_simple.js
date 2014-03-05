if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var cache_proto = require('../core/cache'),
        event_proto = require('../core/event'),
        filter_proto = require('../core/filter'),
        comparator_proto = require('../core/comparator'),
        sorter_proto = require('../core/sorter');

    return {
        __create: function (state, target) {
            var context = this,
                state = state || {},
                target = event_proto.__create(state, target || {});


            state.cache = cache_proto.__create();
            state.requestor.on('success', function (p) {
                console.log("success");
                context.success(state, target, p);
            });

            target.f_mode = function (filter) {
                return context.f_mode(state, target, filter);
            };
            target.filter = function (filter, f_mode) {
                context.filter(state, target, filter, f_mode);
            };
            target.sort = function (sort) {
                context.sort(state, target, sort);
            };

            return target;
        },
        f_mode: function (state, target, filter) {
            return state.filter && comparator_proto.__create(state).narrower(filter) ? 2 : 0;
        },
        filter: function (state, target, filter, f_mode) {

            var mode = f_mode || this.f_mode(state, target, filter);

            if (mode === 2) {
                this.l2_filter(state, target, filter);
            } else {
                this.s_filter(state, target, filter);
            }
        },
        sort: function (state, target, sort) {
            state.sort = sort;

            if (state.cache) {
                state.cache = sorter_proto.__create(sort).execute(state.cache);
                target.emit(this.c_snapshot(state, 2));
            } else {
                this.s_run(state);
            }
        },
        l2_filter: function (state, target, filter) {
            var c_filter = state.filter;

            state.filter = filter;
            state.cache = filer_proto.__create(state).execute(state.cache);
            state.cache = sorter_proto.__create(state.sort).execute(state.cache);
            target.emit(this.c_snapshot(state, 2));
            state.filter = c_filter;
        },
        s_filter: function (state, target, filter) {
            state.filter = filter;

            delete state.cache;
            this.s_run(state);
        },
        success: function (state, target, p) {
            console.log(state);
            state.cache = state.requestor.to_data(p.response).data;
            target.emit(this.c_snapshot(state, 0));
        },
        s_run: function (state) {
            console.log("s_run");
            state.requestor.get({
                filter: state.filter,
                sort: state.sort
            });
        },
        c_snapshot: function (state, mode) {
            return {
                name: 'success',
                filter: state.filter,
                sort: state.sort,
                data: state.cache,
                mode: mode
            };
        }
    };
});