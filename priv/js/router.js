Members.Router.map(function() {
	this.resource('members', { path: '/'});
});

Members.MembersRoute = Ember.Route.extend({
	model: function () {
		return []; //this.store.find('member');
	}
});