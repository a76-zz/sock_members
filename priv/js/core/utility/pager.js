if (typeof define !== 'function') { 
    var define = require('/usr/local/lib/node_modules/amdefine')(module); 
}

define({
    create:function () {
        return {
            page_count: function (count, page_size) {
                var remainder = count % page_size;
                var whole = (count - remainder) / page_size;

                return remainder > 0 ? whole + 1 : whole;
            },
            range: function (count, page_size, current) {
                var to = current * page_size;

                if (count !== undefined) {
                    to = Math.min(current * page_size, count);
                };

                return { from: (current - 1) * page_size, to: to };
            }
        };
    }
});