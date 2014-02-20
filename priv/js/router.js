Members.Router.map(function() {
	this.resource('members', { path: '/'});
});

Members.MembersRoute = Ember.Route.extend({
	model: function () {
		Members.MembersControllerInstance = this.controllerFor('members');
		return []; //this.store.find('member');
	}
});