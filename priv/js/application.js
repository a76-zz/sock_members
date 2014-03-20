define(function (require) {
    var buffer = [
            {first_name_s: "Andrei", last_name_s: "Silchankau"},
            {first_name_s: "Andrei", last_name_s: "Tarkovsky"}
        ],
        storage = require('core/storage'),
        requestor = require('mock/requestor'),
        controller = require('controllers/membersController'),
        __storage = storage.__create({
            requestor: requestor.__create(buffer)
        }),
        state = { 
            storage: __storage.register('members', {
                frame: 1,
                page_size: 2,
                sortering: {
                    key: "first_name_s",
                    asc: true,
                    value: function (current) {
                        return current[this.key];
                    }
                }
            })
        };

    return {
        MembersController: Ember.Controller.extend(controller.__create(state)),
        MembersRoute: require('routers/membersRouter')
    };
}); 


