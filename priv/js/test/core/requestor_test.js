var _requestor = require('../../core/requestor');
var sockjs = require('../../mock/sockjs');
var json = require('../../mock/json');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

buster.testCase("requestor test", {
    get: function () {
        var response,
            buffer = [
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
                SockJS: sockjs.create(buffer),
                JSON: json
            },
            requestor = _requestor.create("members", mock);

        requestor.on('get_members', function (event) {
            response = event.response;
        });
            
        requestor.get({
            key: "members",
        	filtering: {a: 9}
        });

        assert.equals(1, response.total);
        assert.equals(9, response.data[0].a);    
    }    
});