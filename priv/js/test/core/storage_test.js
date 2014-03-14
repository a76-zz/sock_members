var storage_proto = require('../../core/storage');
var requestor_proto = require('../../core/requestor');

var sockjs_mock = require('../../mock/sockjs');
var json_mock = require('../../mock/json');

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
		    ],
		    mock = {
	            SockJS: sockjs_mock.__create(buffer),
	            JSON: json_mock
            },
            started = false,
			snapshot,

	        storage = storage_proto.__create({
			    requestor: requestor_proto.__create({}, mock)
		    }).on('get_members', function (result) {
	            snapshot = result;
		    });

		storage.filter('members', {
			a: 3
		});

		assert.equals(snapshot.data.length, 1),
		assert.equals(snapshot.data[0].a, 3);
	}
});