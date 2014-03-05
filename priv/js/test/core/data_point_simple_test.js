var data_point_proto = require('../../core/data_point_simple');
var event_proto = require('../../core/event');
var filter_proto = require('../../core/filter');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

buster.testCase("data point simple test", {
	"filter": function () {
		var buffer = [
		    {a: 1},
		    {a: 2},
		    {a: 3},
		    {a: 4},
		    {a: 5},
		    {a: 6},
		    {a: 7},
		    {a: 8},
		    {a: 9},
		    {a: 10}
		];

		var started = false,
			snapshot,
			sort = {
				key: "a",
				asc: true,
				value: function (current) {
					return current[this.key];
				}
			};

	    var requestor = {
	    	__create: function () {
                var context = this,
                    target = event_proto.__create();

                target.to_data = context.to_data;
                target.get = function (t) {
                	console.log("get");
                	console.log(t);
                	context.get(target, t);
                };

                return target;
	    	},
	    	to_data: function (response) {
                return response;
	    	},
	    	get: function (target, t) {
                console.log(target);
                var data = filter_proto.__create(t).execute(buffer); 
                target.emit({
                	name: 'success',
                	request: t.request,
                	response: { total: data.length, data: data}
                });  
	    	}
	    };

		var p = data_point_proto.__create({
			sort: sort,
			requestor: requestor.__create()
		}).on('success', function (result) {
            snapshot = result;
		});

		p.filter({
			a: 3
		});

		assert.equals(snapshot.data.length, 1),
		assert.equals(snapshot.data[0].a, 3);

	}
});