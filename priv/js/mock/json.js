if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    stringify: function (request) {
        return request;
    },
    parse: function (data) {
        return data;
    }
});