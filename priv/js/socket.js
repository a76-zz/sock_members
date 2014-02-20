Members.SocketEndpoint = {
    requests: {},
    create: function () {
        var sockjs = new SockJS('/members'),
        context = this;

        sockjs.onopen = function() {
            console.log(' [*] Connected (using: '+sockjs.protocol+')');
        };

        sockjs.onclose = function(e) {
            console.log(' [*] Disconnected ('+e.status + ' ' + e.reason+ ')');
        };
        
        sockjs.onmessage = function(e) {
            var getDataItem = function(member, index) {
                return {
                    id: member.id_i || index,
                    first_name_s: member.first_name_s,
                    last_name_s: member.last_name_s
                };
            },
            getData = function(response) {
                var result = [],
                members = response.data;

                if (members) {
                    for(var index = 0; index < members.length; ++index) {
                        result.push(getDataItem(members[index], index));
                    }    
                }

                return result;
            },
            response = JSON.parse(e.data),
            data = getData(response);

            if (response.action === 'rpc') {
                var request = context.requests[response.uuid];
                Ember.run(null, request.resolve, data);

                // cleanup
                context.requests[response.uuid] = undefined;
            }

            if (response.action === 'update') {
                Members.MembersController.update(data);
            }
        };

        this.socket = sockjs;
        return this;
    },
    send: function(type, data) {
        var context = this,
        generateUuid = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        request = {
            "uuid": generateUuid(),
            "data": data
        };
          
        this.socket.send(JSON.stringify(request));
               
        return new Ember.RSVP.Promise(function(resolve) {
            context.requests[request.uuid] = {
                resolve: resolve
            };
        });
    }
};

Members.Endpoint = Members.SocketEndpoint.create();