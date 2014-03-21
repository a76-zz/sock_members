if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
    Function.prototype.property = function () {return this;};
}

define(function (require) {
    return {
        __create: function (state, target) {
            var context = this,
                state = state || {},
                target = target || {},
                storage = state.storage;

            target.actions = {
                filter: function () {
                    if (!state.subscribed) {
                        context.subscribe(state, this);
                        state.subscribed = true;
                    };
                    
                    storage.filter(state.key, this.get_filtering());
                },
                sort: function (key) {
                    var sortering = this.get('snapshot.sortering');

                    storage.sort(state.key, {
                        key: key,
                        asc: sortering.key === key ? !sortering.asc : true
                    });
                },
                change_page_size: function () {
                    var page_size = this.get('snapshot.page_size');
                    storage.change_page_size(state.key, page_size);
                },
                to_page: function (index) {
                    storage.to_page(state.key, index);
                },
                select_item: function (item) {
                    var selection = this.get('selection');
                    if (selection) {
                        selection.set('selected', false);
                    }
                    
                    item.set('selected', true);
                    this.set('selection', item);
                }
            };

            target.is_empty = function () {
                var total = this.get('snapshot.total');
                return (total === undefined || total === 0);  
            }.property('snapshot');

            return target;          
        },
        subscribe: function (state, context) {
            state.storage.on('get_' + state.key, function (output) {
                var data = [];

                for (var index = 0; index < output.data.length; ++index) {
                    data.push(Ember.Object.create({
                        index: index,
                        selected: false,
                        content: output.data[index]
                    }));
                }

                output.data = data;
                context.set('snapshot', output);
            });
        }
        
    };
});