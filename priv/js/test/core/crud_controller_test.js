var crud_controller_proto = require('../../core/crud_controller');
var sockjs_mock = require('../../mock/sockjs');
var json_mock = require('../../mock/json');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;

buster.spec.expose();

buster.testCase("crud controller test", {
	get: function () {
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

        var state = {};

        var controller = crud_controller_proto.__create({
        	get_filtering: function (controller) {
        		return {
        			a: controller.a
        		};
        	}
        }, 
        {
        	set: function (name, value) {
                state[name] = value;
        	},
        }, mock);

        controller.a = 8;

        controller.actions.filter();

        assert.equals(1, state.model.length);
        assert.equals(8, state.model[0].a);
	}
});