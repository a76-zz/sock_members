var requestor_proto = require('../../core/requestor');
var sockjs_proto = require('../../mock/sockjs');
var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

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
var SockJS = sockjs_proto.__create(buffer);

var JSON = {
	stringify: function (request) {
		return request;
	},
	parse: function (data) {
		return data;
	}
};

buster.spec.expose();

buster.testCase("requestor test", {
    get: function () {
        var requestor = requestor_proto.__create().
        	on('get', function (event) {
                e = event;
        	}),
        	snapshot;

        requestor.get ({
        	filtering: {a: 9}
        });

        assert.equals(e.response.total, 1);
        assert.equals(e.response.data[0].id, 0);
        assert.equals(e.response.data[0].a, 9);    
    }    
});