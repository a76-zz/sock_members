Members.MembersController = Ember.ArrayController.extend({
	actions: {
		filter: function() {
			var first_name = this.get('first_name').trim(),
			last_name = this.get('last_name').trim(),
			request = "";

			if (first_name) {
				request = "first_name_s:" + first_name;
			}

			return this.store.find('member', request);
		}
	}
});