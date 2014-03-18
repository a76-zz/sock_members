if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	return {
        __create: function (state, target) {
            var context = this,
                state = state || {},
                target = event_proto.__create(state, target || {});

            /*state.cache = {};
            state.l2cache = {};
            
            state.filtering = {};
            state.l2filtering = {};

            state.sortering = {};

            state.page = {};
            state.page_size = {};
            state.total = {};
            state.__keys = {};*/
            
            state.pager = pager_proto.__create();
            state.filter = filter_proto.__create();
            state.sorter = sorter_proto.__create();
            state.comparator = comparator_proto.__create();

            target.to_page = function (key, page) {
                context.to_page(key, state, target, page);
            };

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
        create: function (key, state, target) {
        	var context = this;

            state[key] = {};
            state.requestor.on('get_' + key, function (event) {
                state[key].cache = state.requestor.to_data(event.response).data;
                target.emit(context.get_snapshot(key, state, 0));
            });
        }, 
        get_snapshot: function (key, state, mode) {
        	var context = state[key],
        	    cache = context.l2cache || context.cache,
        	    range = state.pager.range(cache.count(), )
            return {
                name: 'get_' + key,
                mode: mode,
                filtering: context.l2filtering || context.filtering,
                page: context.page,
                page_size: context.page_size,
                page_count: pager.page_count(key, context.page_size),
                range: pager.range(key, state.page_size[key], state.page[key]),
                total: total || state.total[key],
                
                data: state.l2cache[key] || state.cache[key],
                pages: pager.pages(state.page_size[key], )
                
            };
        },
        to_page: function (key, state, target, page) {
            state[key].page = page;

            

            if (that.l2cache[key]) {
                target.emit({
                    
                });
            } 
        },

        s_run: function (key, state, target) {
            this.add_callback(key, state, target);

            state.requestor.get({
                key: key,
                filtering: state.filtering[key],
                sortering: state.sortering[key]
            });
        },
        data: function (key, state, pager, total) {
            var range = pager.range(total, state.page_size[key], state.page[key]);

            return state.
        },
       
        add_callback: function (key, state, target) {
            var context = this;

            if (!state.__keys[key]) {
                state.requestor.on('get_' + key, function (event) {
                    state.cache[key] = state.requestor.to_data(event.response).data;
                    target.emit(context.c_snapshot(key, state, 0));
                });

                state.__keys[key] = key;
            } 
        }
	};

});

