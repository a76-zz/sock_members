if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var sockjs = require('../mock/sockjs'),
	    json = require('../mock/json'),
	    requestor = require('../core/requestor');

    return {
    	create: function(buffer) {
	    	var mock = {
	            SockJS: sockjs.create(buffer),
	            JSON: json
	        };

	        return requestor.create("members", mock);
        }
    };
});