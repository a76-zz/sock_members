if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var data_point_simple_proto = require('../core/data_point_simple'),
        requirestor_proto = require('../core/requestor');

    return {
        __create: function (state, target) {
        	var context = this,
        	    state = state || {},
        	    target = target || {};

        	
        }
    }
});