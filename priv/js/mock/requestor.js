if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var sockjs = require('../mock/sockjs'),
	    json = require('../mock/json'),
	    requestor = require('../core/requestor');

    return {
    	__create: function(buffer) {
	    	var mock = {
	            SockJS: sockjs.__create(buffer),
	            JSON: json
	        };

	        return requestor.__create({}, mock);
        }
    };
});