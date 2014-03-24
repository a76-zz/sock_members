define(function (require) {
	var listPagingView = require('../views/abstract/listPagingView');
    return listPagingView.extend({
        tagName: "div",
        templateName: "members-list-paging"
    });	
});