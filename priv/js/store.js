/**
* Implementation of WebSocket for DS.Store
*/

Members.CreateSocket = function() {
    var sockjs_url = '/members';
    var sockjs = new SockJS(sockjs_url);

    sockjs.onopen = function() {
        console.log(' [*] Connected (using: '+sockjs.protocol+')');
    };
    sockjs.onclose = function(e) {
        console.log(' [*] Disconnected ('+e.status + ' ' + e.reason+ ')');
    };

    return sockjs;
};

Members.Store = DS.Store.extend({
    revision: 4,
    adapter: DS.Adapter.extend({
        socket: Members.CreateSocket(),

        requests: undefined,
        
        generateUuid: function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },

        send: function(type, data) {
            var context = this,
            request = {
                "uuid": this.generateUuid(),
                "data": data
            };
          
            this.socket.send(JSON.stringify(request));
               
            return new Ember.RSVP.Promise(function(resolve) {
                context.get('requests')[request.uuid] = {
                    resolve: resolve
                };
            });
        },

        find: function (store, type, id) {
            return [];
        },

        findMany: function (store, type, ids, query) {
            return [];
        },

        findQuery: function (store, type, query) {
            return this.send(type, query);
        },

        findAll: function (store, type) {
            return [];
        },

        /* Also implement:
         * createRecord & createRecords
         * updateRecord & updateRecords
         * deleteRecord & deleteRecords
         * commit & rollback
         */

        init: function () {

            var context = this;
            this.set('requests', {});

            var sockjs = this.get('socket');

            var getData = function(response) {
                var result = [],
                members = response.data;

                /*if (members && !members.length) {
                    members = [members];
                }*/

                if (members) {
                    for(var index = 0; index < members.length; ++index) {
                        result.push({
                            id: members[index].id_i,
                            first_name_s: members[index].first_name_s,
                            last_name_s: members[index].last_name_s
                        })
                    }    
                }

                return result;
            };
            
            sockjs.onmessage = function(e) {
                var response = JSON.parse(e.data);
                
                var data = getData(response);
                var request = context.get('requests')[response.uuid];

                Ember.run(null, request.resolve, data);

                /* Cleanup */
                context.get('requests')[response.uuid] = undefined;
            };
        }

    })
});

