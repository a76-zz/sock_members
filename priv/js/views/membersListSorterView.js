define(function (require) {
    var listSorterView = require('../views/abstract/listSorterView');

    return listSorterView.extend({
        tagName: "th",
        templateName: "members-list-sorter"
    });
});