if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var filter_proto = require('../core/filter');

	return {
	    __create: function (buffer) {
	    	function SockJS () {
	            this.filter = filter_proto.__create();    
	    	};

	    	SockJS.prototype.send = function (request) {
	            var data = this.filter.execute(request.filtering, buffer);

	            this.onmessage({
	            	key: request.key,
	            	action: 'rpc',
	            	request: request,
	            	data: data,
	            	total: data.length
	            });
	    	}; 

	    	return SockJS;
		}
    };   	
});