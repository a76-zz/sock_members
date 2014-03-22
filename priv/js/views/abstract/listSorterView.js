define(function (require) {
    return Em.View.extend({
        entered: false,
        mouseEnter: function (event) {
            this.set('entered', true);
        },
        mouseLeave: function (event) {
            this.set('entered', false);
        }
    });
});