define(function (require) {
    return Em.View.extend({
        entered: false,
        eventManager: Em.Object.create({
            mouseEnter: function (event, view) {
              view.set('entered', true);
            },
            mouseLeave: function (event, view) {
              view.set('entered', false);
            }
        })
    });
});