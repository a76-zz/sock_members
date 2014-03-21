define(function (require) {
    var sorterView = require('../views/abstract/sorterView');

    return sorterView.extend({
        tagName: "th",
        templateName: "members-header-item"
    });
});