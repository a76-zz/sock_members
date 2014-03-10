if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (state, target) {
        var context = this,
            state = state || {},
            target = target || {};

        state.handlers = [];
        
        target.emit = function (event) {
            context.emit(state, event);
            return target;
        };

        target.on = function (name, handler) {
            context.on(state, name, handler);
            return target;
        };

        return target;
    },
    emit: function (state, event) {
        var handlers = state.handlers[event.name];

        if (handlers) {
            for (var index = 0; index < handlers.length; ++index) {
               handlers[index](event);
            }
        }
    },
    on: function (state, name, handler) {
        if (state.handlers[name] === undefined) {
            state.handlers[name] = [];
        }

        state.handlers[name].push(handler);
    }
});