var navigator = require('../../core/navigator');
var storage = require('../../core/storage');
var requestor = require('../../mock/requestor');

var buster = require('/usr/local/lib/node_modules/buster');
var assert = buster.assert;
buster.spec.expose();

var create_storage = function (buffer, page_size, capacity) {
    return storage.__create({
            requestor: requestor.__create(buffer)
        }).register('members', {
            frame: 1,
            page_size: page_size,
            capacity: capacity,
            sortering: {
                key: "a",
                asc: true,
                value: function (current) {
                    return current[this.key];
                }
            }
        });
};

buster.testCase("navigator", {
	filtering: function () {
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
                storage: create_storage(buffer, 2, null),
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
            controller = navigator.__create(state, target);

        controller.actions.filter.call(controller);

        console.log(state.model);

        assert.equals(1, state.model.data.length);
        assert.equals(8, state.model.data[0].a);
	}
});