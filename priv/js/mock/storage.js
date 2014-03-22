if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
	var requestor = require('../mock/requestor');
    return {
    	create: function (state) {
    		return storage.create(requestor.create(state.buffer)).register('members', state.config);
    	}
    };
});