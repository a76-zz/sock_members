define(function (require) {
	//Members.ApplicationAdapter = DS.FixtureAdapter.extend();
	var membersController = require('controllers/membersController');

    return {
    	MembersController: Ember.ArrayController.extend(membersController),
        MembersRoute: require('routers/membersRoute')
    };
}); 


