/**
* Implementation of WebSocket for DS.Store
*/
Members.Store = DS.Store.extend({
    revision: 4,
    adapter: DS.Adapter.extend({

        requests: undefined,

        find: function (store, type, id) {
            return [];
        },

        findMany: function (store, type, ids, query) {
            return [];
        },

        findQuery: function (store, type, query) {
            return Members.Endpoint.send(type, query);
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
            
        }

    })
});

