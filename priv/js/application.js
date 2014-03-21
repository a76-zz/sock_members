define(function (require) {
    var buffer = [
            {first_name_s: "Andrei", last_name_s: "Silchankau"},
            {first_name_s: "Andrei", last_name_s: "Tarkovsky"},
            {first_name_s: "Andrei", last_name_s: "Tamelo"}
        ],
        storage = require('core/storage'),
        requestor = require('mock/requestor'),
        controller = require('controllers/membersController'),
        __storage = storage.__create({
            requestor: requestor.__create(buffer)
        }).register('members', {
            frame: 1,
            page_size: 2,
            sortering: {
                key: "first_name_s",
                asc: true,
                value: function (current) {
                    return current[this.key];
                }
            }
        });

    return {
        GlobalStorage: __storage,
        MembersController: controller.__create(__storage),
        MembersRoute: require('routers/membersRouter'),
        MembersItemView: require('views/membersItemView'),
        SorterIndicatorView: require('views/abstract/sorterIndicatorView'),
        MembersHeaderItemView: require('views/membersHeaderItemView'),
        MembersHeaderView: require('views/membersHeaderView')
    };
}); 


