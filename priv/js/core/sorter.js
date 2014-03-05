if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    __create: function (state) {
        var context = this,
        state = state || { value: function(current) { return 0; }, asc: false },
        target = target || {};

        target.execute = function (data) {
            return context.sort(state, data);
        };

        return target;
    },
    asc_sorter: function (that, a, b) {
    	return that.value(a) > that.value(b) ? 1 : -1;
    },
    desc_sorter: function (that, a, b) {
        return that.value(a) < that.value(b) ? 1 : -1;
    },
    sort: function (that, data) {
        var type = this;

        if (that.asc) {
        	return data.sort(function (a, b) {
        		return type.asc_sorter(that, a, b);
        	});
        } else {
        	return data.sort(function (a, b) {
        		return type.desc_sorter(that, a, b);
        	});
        }
    }       
});