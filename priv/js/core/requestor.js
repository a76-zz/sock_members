if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var event_proto = require('../core/event');

    return {
        __create: function(state, mock) {
            var context = this,
                state = state || {},
                target = event_proto.__create();

            state.JSON = mock ? mock.JSON : JSON;
            state.SockJS = mock ? mock.SockJS: SockJS;
                
            state.socket = new state.SockJS(state.path);
            
            state.socket.onopen = function() {
                console.log(' [*] Connected (using: '+sockjs.protocol+')');
            };

            state.socket.onclose = function(e) {
                console.log(' [*] Disconnected ('+e.status + ' ' + e.reason+ ')');
            };

            state.socket.onmessage = function (response) {
                context.onmessage(state, target, response);
            };

            target.get = function (request) {
                context.get(state, target, request);
            };

            target.to_data = function (response) {
                return response;
            };

            return target;
        },
        get: function (state, target, request) {
            target.emit({
                name: 'start_' + request.key,
                request: request
            });

            state.socket.send(state.JSON.stringify(request));
        },
        get_data: function (response) {
            var result = [],
                members = response.data,
                convert_item = function (item, index) {
                    item.id = item.id_i || index;
                    return item;
                };

            if (members) {
                for(var index = 0; index < members.length; ++index) {
                    result.push(convert_item(members[index], index));
                }    
            }

            return result;
        },
        onmessage: function (state, target, message) {
            var response = state.JSON.parse(message),
                data = this.get_data(response),
                name = response.action === 'rpc' ? 'get' : 'update';

            target.emit({
                name: name + '_' + response.key,
                key: response.key,
                request: response.request,
                response: {total: response.total, data: data}
            });
        }
    };
});