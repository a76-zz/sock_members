var sockjs = require('../../mock/sockjs');
var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

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

var SockJS = sockjs.__create(buffer);

buster.testCase("sockjs mock test", {
	send: function () {
		var socket = new SockJS(),
		    snapshot;

		socket.onmessage = function (response) {
            snapshot = response;
		};

		socket.send({
			filtering: {
				a: 5
			}
		});

		assert.equals(snapshot.data.length, 1);
		assert.equals(snapshot.data[0].a, 5);

		assert.equals(snapshot.action, 'rpc');
	}
})