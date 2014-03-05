if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (state, target) {
        var context = this,
            state = state || {},
            target = target || {};

        if (!state.handlers) {
            state.handlers = [];
        }

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
        var handler = state.handlers[event.name];

        if (handler) {
            handler(event);
        }
    },
    on: function (state, name, handler) {
        state.handlers[name] = handler;
    }
});