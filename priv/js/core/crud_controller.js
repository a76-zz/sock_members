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
                    var filtering = state.get_filtering(this),
                        context = this;

                    if (!state.subscribed) {
                        state.storage.on('get_' + state.key, function (output) {
                            context.set('model', output.data);
                        });

                        state.subscribed = true; 
                    }
                    state.storage.filter(state.key, filtering);
                }
            };

            target.isEmpty = function () {
                return this.get('model.length') === 0;   
            }.property('model.length');

            target.updates = [];

            target.allUpdates = function () {
                return this.get('udates');
            }.property('updates.@each');

            return target;      	
        }
    };
});