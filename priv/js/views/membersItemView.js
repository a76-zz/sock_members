define(function (require) {
	var listItemView = require('../views/listItemView');
	return listItemView.extend({
		tagName: "tr",
		templateName: "members-item",
        classNameBindings: ['selected:selected', 'itemClass'],
        itemClass: function() {
            return this.get('data.id') % 2 === 0 ? "even" : "odd";
        } .property()
	});
});