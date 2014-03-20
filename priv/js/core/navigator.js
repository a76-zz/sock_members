if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
    Function.prototype.property = function () {return this;};
}

define(function (require) {
    return {
        __create: function (state, target) {
        	var context = this,
        	    state = state || {},
        	    target = target || {};

            target.actions = {
                filter: function () {
                    var filtering = state.get_filtering(this);

                    context.subscribe(state, this);
                    state.storage.filter(state.key, filtering);
                },
                change_page_size: function () {
                    var page_size = this.get('model.page_size');
                    state.storage.change_page_size(state.key, page_size);
                },
                to_page: function (index) {
                    state.storage.to_page(state.key, index);
                }
            };

            target.is_empty = function () {
                var total = this.get('model.total');
                return (total === undefined || total === 0);  
            }.property('model.total');

            return target;      	
        },
        subscribe: function (state, context) {
            if (!state.subscribed) {
                state.storage.on('get_' + state.key, function (output) {
                   context.set('model', output);
                });

                state.subscribed = true; 
            }
        }
    };
});