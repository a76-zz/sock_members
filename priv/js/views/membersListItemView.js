define(function (require) {
	var listItemView = require('../views/abstract/listItemView');
	return listItemView.extend({
		tagName: "tr",
		templateName: "members-list-item",
        classNameBindings: ['even:even:odd', 'selected:selected']
	});
});