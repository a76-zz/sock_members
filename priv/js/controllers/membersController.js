define(function(require) {
    var navigator = require('../core/navigator');

    return {
        __create : function (storage) {
            var result = Ember.Controller.extend(
                navigator.__create({
                  key: 'members',
                  storage: storage
                })
            );

            result.reopen({
                get_filtering: function() {
                    return {
                        first_name_s: this.get('first_name')
                    };
                }
            });

            return result;
        }
    }
});