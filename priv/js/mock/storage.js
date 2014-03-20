if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var requestor = require('../mock/requestor');
    return {
    	__create: function (state) {
    		return storage.__create({
    			requestor: requestor.__create(state.buffer)
    		}).register('members', state.config);
    	}
    };
});