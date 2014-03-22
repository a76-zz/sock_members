define(function (require) {
    var collectionController = require('../controllers/abstract/collectionController');

    return {
        create : function (storage) {
            return collectionController.extend({
                key: 'members',
                storage: storage,
                get_filtering: function () {
                    return {
                        first_name_s: this.get('first_name')
                    };
                }
            });
        }
    };
});