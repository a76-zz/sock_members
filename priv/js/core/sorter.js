if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (target) {
        var context = this, 
            target = target || {};

        target.execute = function (sorter, data) {
            return context.sort(sorter, data);
        }
        target.position = function (sorter, data, value) {
            return context.position(sorter, data, value);
        };
        return target;
    },
    asc_sorter: function (sorter, a, b) {
        return sorter.value(a) > sorter.value(b) ? 1 : -1;
    },
    desc_sorter: function (sorter, a, b) {
        return sorter.value(a) < sorter.value(b) ? 1 : -1;
    },
    sort: function (sorter, data) {
        var type = this;

        if (sorter.asc) {
            return data.sort(function (a, b) {
                return type.asc_sorter(sorter, a, b);
            });
        } else {
            return data.sort(function (a, b) {
                return type.desc_sorter(sorter, a, b);
            });
        }
    }    
});