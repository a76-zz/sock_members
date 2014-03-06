if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (target) {
        var context = this,
            target = target || {};
        
        target.execute = function (filter, data) {
            return context.execute(filter, data);
        };
        return target;
    },
    include: function (filter, current) {
        var prop,
            filter_value,
            current_value;

        for (prop in filter) {
            if (filter.hasOwnProperty(prop)) {
                filter_value = filter[prop];

                if (filter_value !== undefined && filter_value !== null) {

                    current_value = current[prop];

                    if (typeof current_value === 'string') {
                        if (current_value.toLowerCase().indexOf(filter_value.toLowerCase()) === -1) {
                            return false;
                        }
                    } else if (current_value !== filter_value) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    },

    execute: function (filter, data) {
        var current,
            index,
            result = [];

        if (filter !== undefined) {
            for (index = 0; index < data.length; index++) {
                current = data[index];
                if (this.include(filter, current)) {
                    result.push(current);
                }
            }
        } else {
            result = data;
        }

        return result;
    }
});