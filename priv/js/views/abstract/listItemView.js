define(function (require) {
    return Ember.View.extend({
        selected: function() {
            return this.get('item.selected');
        } .property('item.selected'),
        even: function() {
            return this.get('item.index') % 2 === 0;
        } .property(),
        eventManager: Em.Object.create({
            click: function(event, view) {
                view.get('controller').send('select_item', view.item);
            }
        })
    });
});