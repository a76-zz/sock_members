define(function(require) {
    return Ember.ArrayController.extend({
		actions: {
			filter: function() {
				var first_name = this.get('first_name'),
				query = "*";
			
				if (first_name) {
					query = "first_name_s:" + first_name;
				}
	        
	        	var context = this;
				return Members.Endpoint.send('members', query).then(function(data) {
					context.set('model', data);
				});
			}
		},
		isEmpty: function() {
			var length = this.get('model.length');
	        return length === 0;
		}.property('model.length'),

		updates: [],
		update: function(members) {
			for (var index=0; index < members.length; ++index) {
				this.get('updates').pushObject(members[index]);
			}
		},
	    allUpdates: function() {
	    	return this.get('updates');
	    }.property('updates.@each')
	};
});