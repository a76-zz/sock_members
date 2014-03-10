if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function(state) {
        var context = this,
            state = state || {},
            target = event_proto.__create();

        state.socket = new SockJS(state.path);

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
            name: 'start',
            request: request
        });

        state.socket.send(JSON.stringify(request));
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
    onmessage: function (state, target, response) {
        var data = this.get_data(JSON.parse(response.data)),
            name = response.action === 'rpc' ? 'get' : 'update';

        target.emit({
            name: name,
            response: {total: data.length, data: data}
        });
    }
});