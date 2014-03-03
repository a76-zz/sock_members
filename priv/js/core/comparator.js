if (typeof define !== 'function') { var define = require('/usr/local/lib/node_modules/amdefine')(module) }

define({
    __create: function (state) {
        var context = this,
            state = state || { filter: {} },
            target = target || {};

        target.narrower = function (filter) {
            return context.narrower(state.filter, filter);
        };

        return target;
    },
    narrower: function (current, requested) {
        var c_value,
            r_value,
            prop;
          
        for (prop in current) {
            if (current.hasOwnProperty(prop)) {
                c_value = current[prop];
                r_value = requested[prop];

                if (typeof (c_value) == 'string') {
                    if (r_value === undefined ||
                        r_value === null ||
                        r_value.indexOf(c_value) !== 0) {
                      return false;
                    }
                }
                else {
                    if (r_value !== c_value &&
                        c_value !== undefined &&
                        c_value !== null) {
                      return false;
                    }
                }
            }
        }

        return true;
    }       
});