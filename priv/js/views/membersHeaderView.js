define(function (require) {
	return Ember.View.extend({
		tagName: "tr",
        templateName: "members-header"
	});
});

//{{view Members.SorterIndicatorView tagName="a" templateName="sorter-indicator" ascClass="asc" descClass="desc" enteredBinding="view.entered"}}