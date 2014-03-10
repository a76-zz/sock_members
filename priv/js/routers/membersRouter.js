define(function (require) {
	return Ember.Route.extend({
        model: function () {
    	    // this.controllerFor('members');
    	    return [];
        }
    });
});