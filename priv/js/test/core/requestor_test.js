var requestor_proto = require('../../core/requestor');


var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

var sockjs_mock = require('../../mock/sockjs');
var json_mock = require('../../mock/json');



buster.spec.expose();

buster.testCase("requestor test", {
    get: function () {
        var e;

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

        var mock = {
            SockJS: sockjs_mock.__create(buffer),
            JSON: json_mock
        };

        var requestor = requestor_proto.__create({}, mock).on('get', 
            function (event) {
                e = event;
            }
        );
            
        requestor.get ({
        	filtering: {a: 9}
        });

        assert.equals(e.response.total, 1);
        assert.equals(e.response.data[0].id, 0);
        assert.equals(e.response.data[0].a, 9);    
    }    
});