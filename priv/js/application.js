define(function (require) {
	//Members.ApplicationAdapter = DS.FixtureAdapter.extend();
    return {
    	MembersController: require('controllers/membersController'),
        MembersRoute: require('routers/membersRoute')
    };
}); 


