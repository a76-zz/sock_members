if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    create: function(key, mock) {
        var JSON = mock ? mock.JSON : JSON,
            SockJS = mock ? mock.SockJS: SockJS,
            socket = new SockJS(key),
            result = {
                handlers: {},
                emit: function (event) {
                    var handlers = this.handlers[event.name];

                    if (handlers) {
                        for (var index = 0; index < handlers.length; ++index) {
                           handlers[index](event);
                        }
                    }
                    return this;
                },
                on: function (name, handler) {
                    if (this.handlers[name] === undefined) {
                        this.handlers[name] = [];
                    }

                    this.handlers[name].push(handler);
                    return this;
                },
                get: function (request) {
                    this.emit({
                        name: 'start_' + request.key,
                        request: request
                    });

                    socket.send(JSON.stringify(request));
                }
            };

        socket.onmessage = function (message) {
            var response = JSON.parse(message),
            name = response.action === 'rpc' ? 'get' : 'update';

            result.emit({
                name: name + '_' + response.key,
                key: response.key,
                request: response.request,
                response: {total: response.total, data: response.data}
            });
        };

        return result;
    }
});