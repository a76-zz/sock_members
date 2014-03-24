define(function (require) {
	var pagination = require('../../core/utility/pagination').create();
	return Ember.View.extend({
		pages: function () {
            return pagination.pages(this.get('controller.snapshot.page'), this.get('controller.snapshot.page_count'), this.get('frame') || 1);
		} .property('controller.snapshot')
	});
});