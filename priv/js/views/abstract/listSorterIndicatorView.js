define(function (require) {
    return Ember.View.extend({
        classNameBindings: ['asc', 'visible:visible:hidden'],
        asc: function () {
        	return this.get('controller.snapshot.sortering.asc') === true ? this.get('ascClass') : this.get('descClass');
        }.property('controller.snapshot'),
        title: function () {
            return this.get('controller.snapshot.sortering.asc') === true ? "asc" : "desc";
        }.property('asc'),
        visible: function () {
        	return this.get('controller.snapshot.sortering.key') === this.get('key') || this.get('entered');
        }.property('controller.snapshot', 'entered'),
        click: function (event) {
            this.get('controller').send('sort', this.key);
        }
    });
});