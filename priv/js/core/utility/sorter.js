if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    create: function () {
        return {
            asc_sortering: function (sortering, a, b) {
                return sortering.value(a) > sortering.value(b) ? 1 : -1;
            },
            desc_sortering: function (sortering, a, b) {
                return sortering.value(a) < sortering.value(b) ? 1 : -1;
            },
            execute: function (sortering, data) {
                var context = this;

                if (sortering.asc) {
                    return data.sort(function (a, b) {
                        return context.asc_sortering(sortering, a, b);
                    });
                } else {
                    return data.sort(function (a, b) {
                        return context.desc_sortering(sortering, a, b);
                    });
                }
            }
        };
    }   
});