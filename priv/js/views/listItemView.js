define(function (require) {
    return Ember.View.extend({
        selected: function() {
            return this.get('data.selected');
        } .property('data.selected'),
        eventManager: Em.Object.create({
            click: function(event, view) {
                view.get('controller').send('select_item', view.data);
            }
        })
    });
});