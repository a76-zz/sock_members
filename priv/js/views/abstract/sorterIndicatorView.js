define(function (require) {
    return Ember.View.extend({
        classNameBindings: ['asc:ascCalss:descClass', 'visible:visible:hidden'],
        asc: function () {
        	return this.get('controller.snapshot.sortering.asc') === true ? this.get('ascClass') : this.get('descClass');
        }.property('controller.snapshot'),
        title: function () {
            return this.get('controller.snapshot.sortering.asc') === true ? "asc" : "desc";
        }.property('asc'),
        visible: function () {
        	return this.get('controller.snapshot.sortering.key') === this.get('key') || this.get('entered');
        }.property('controller.snapshot', 'entered'),
        eventManager: Ember.Object.create({
        	click: function (event, view) {
        		view.get('controller').send('sort', view.key);
        	}
        })
    });
});