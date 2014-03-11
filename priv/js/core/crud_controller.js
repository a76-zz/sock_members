if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define(function (require) {
    var data_point = require('../core/data_point_simple'),
        requestor = require('../core/requestor');

    return {
        __create: function (state, target, mock) {
        	var context = this,
        	    state = state || {},
        	    target = target || {};

            state.data_point = data_point.__create({
                requestor: requestor.__create({}, mock)
            });

            state.data_point.on('get', function (output) {
                target.set('model', output.data);
            }); 

            target.actions = {
                filter: function () {
                    var request = state.request(target);
                    state.data_point.filter(request.filtering);
                }
            };

            return target;      	
        }
    };
});