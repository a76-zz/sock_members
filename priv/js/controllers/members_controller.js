Members.MembersController = Ember.ArrayController.extend({
	actions: {
		filter: function() {
			var first_name = this.get('first_name').trim(),
			query = "*";
			
			if (first_name) {
				query = "first_name_s:" + first_name;
			}
            
            var context = this;
			return this.store.findQuery('member', query).then(function(data) {
				context.set('model', data);
			});
		}
	},
	isEmpty: function() {
		var length = this.get('model.length');
        return length === 0;
	}.property('model.length')
});