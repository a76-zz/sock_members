var crud_controller_proto = require('../../core/crud_controller');
var storage_proto = require('../../core/storage');
var requestor_mock = require('../../mock/requestor');

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
            ],
            state = {
                key: 'members',
                storage: storage_proto.__create({
                    requestor: requestor_mock.__create(buffer)
                }),
                get_filtering: function () {
                    return {
                        a: 8
                    };
                }
            },
            target = {
                set: function (name, value) {
                    state[name] = value;
                }
            },
            controller = crud_controller_proto.__create(state, target);

        controller.actions.filter.call(controller);

        assert.equals(1, state.model.length);
        assert.equals(8, state.model[0].a);
	}
});