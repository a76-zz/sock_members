define(function (require) {
    return Ember.View.extend({
        selected: function() {
            return this.get('item.selected');
        } .property('item.selected'),
        even: function() {
            return this.get('item.index') % 2 === 0;
        } .property(),
        click: function (event) {
            this.get('controller').send('select_item', this.item);
        }
    });
});