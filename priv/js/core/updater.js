if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (state, target) {
        var context = this,
            target = target || {};

        state.requestor.on('update', function (event) {
            context.update(state, target, event);
        });

        return target;
    },
    update: function (sate, target, event) {
        var data = state.data(),
            internal = state.filter.execute(state.filtering(), event.data),
            sortering = state.sortering(),
            item;

        if (internal.length > 0) {
            for (var index = 0; index < internal.length; ++index) {
                item = internal[index];
                if (!state.update(item)) {
                    state.insert(this.position(sortering, data, item), item)
                }
            }
        }
    },
    position: function (sortering, data, value) {
        var position = 0;

        if (sortering.asc) {
            while (position < data.length && 
                  (sortering.value(data[position]) < sortering.value(value))) {
                position = position + 1;
            }
        } else {
            while (position < data.length &&
                  (sortering.value(data[position]) > sortering.value(value))) {
                position = position + 1;
            }
        }

        return position;
    }   
    
});