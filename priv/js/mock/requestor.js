if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var sockjs_mock = require('../mock/sockjs'),
	    json_mock = require('../mock/json'),
	    requestor_proto = require('../core/requestor');

    return {
    	__create: function(buffer) {
	    	var mock = {
	            SockJS: sockjs_mock.__create(buffer),
	            JSON: json_mock
	        };

	        return requestor_proto.__create({}, mock);
        }
    };
});