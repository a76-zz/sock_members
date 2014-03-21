define(function (require) {
	var listItemView = require('../views/abstract/itemView');
	return listItemView.extend({
		tagName: "tr",
		templateName: "members-item",
        classNameBindings: ['even:even:odd', 'selected:selected']
	});
});