var ID          = 'uuid';

var FIND        = 'find';
var FIND_MANY   = 'findMany';
var FIND_QUERY  = 'findQuery';
var FIND_ALL    = 'findAll';

/**
* Implementation of WebSocket for DS.Store
*/
Members.Store = DS.Store.extend({
    revision: 4,
    adapter: DS.Adapter.extend({
        socket: undefined,

        requests: undefined,
        
        generateUuid: function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },

        send: function(action, type, data, result) {
            /* Specific to your web socket server side implementation */
            var request = {
                "uuid": this.generateUuid(),
                "action": action,
                "type": type.toString().substr(1),
                "data": data
            };
            this.socket.send(JSON.stringify(request));
            /* So I have access to the original request upon a response from the server */
            this.get('requests')[request.uuid] = request;
            return request;
        },

        find: function (store, type, id) {
            this.send(FIND, type, id);
        },

        findMany: function (store, type, ids, query) {
            this.send(FIND_MANY, type, ids);
        },

        findQuery: function (store, type, query, modelArray) {
            this.send(FIND_QUERY, type, query, modelArray).modelArray = modelArray;
        },

        findAll: function (store, type) {
            this.send(FIND_ALL, type);
        },

        create: function () {

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

            var sockjs_url = '/members';
            var sockjs = new SockJS(sockjs_url);

            sockjs.onopen = function() {
                console.log(' [*] Connected (using: '+sockjs.protocol+')');
            };
            sockjs.onclose = function(e) {
                console.log(' [*] Disconnected ('+e.status + ' ' + e.reason+ ')');
            };
            
            sockjs.onmessage = function(e) {
                var response = JSON.parse(e.data);
                var request = context.get('requests')[response.uuid];

                switch (request.action) {
                    case FIND:
                        App.store.load(type, response.data[0]);
                        break;
                    case FIND_MANY:
                        App.store.loadMany(type, response.data);
                        break;
                    case FIND_QUERY:
                        request.modelArray.load(response.data);
                        break;
                    case FIND_ALL:
                        App.store.loadMany(type, response.data);
                        break;
                    default:
                        throw('Unknown Request: ' + request.action);
                }

                /* Cleanup */
                context.get('requests')[response.uuid] = undefined;
            };

            this.set('socket', sockjs);
        }

    })
});

