define(function(require) {
	var buffer = [
	        {first_name_s: "Andrei", last_name_s: "Silchankau"},
	        {first_name_s: "Andrei", last_name_s: "Tarkovsky"}
	    ],
	    requestor = require('../mock/requestor'),
	    storage = require('../core/storage'),
	    crud_controller = require('../core/crud_controller'),
	    state = {
	    	key: 'members',
	    	storage: storage.__create({
                 requestor: requestor.__create(buffer)
            }),
            get_filtering: function (that) {
                return {
                    first_name_s: that.get('first_name')
                };
            }
	    };

	return crud_controller.__create(state, {});
});