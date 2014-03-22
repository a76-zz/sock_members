define(function (require) {
    var buffer = [
            {first_name_s: "Andrei", last_name_s: "Silchankau"},
            {first_name_s: "Andrei", last_name_s: "Tarkovsky"},
            {first_name_s: "Andrei", last_name_s: "Tamelo"}
        ],
        requestor = require('mock/requestor').create(buffer),
        storage = require('core/storage').create(requestor),
        controller = require('controllers/membersController');


    storage.register('members', {
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
        Storage: storage,
        MembersController: controller.create(storage),
        MembersRoute: require('routers/membersRouter'),
        MembersFilterView: require('views/membersFilterView'),
        ListSorterIndicatorView: require('views/abstract/listSorterIndicatorView'),
        MembersListSorterView: require('views/membersListSorterView'),
        MembersListHeaderView: require('views/membersListHeaderView'),
        MembersListItemView: require('views/membersListItemView'),
        MembersListPagingView: require('views/membersListPagingView'),
        MembersListView: require('views/membersListView'),
        FilterInputView: require('views/abstract/filterInputView')
    };
}); 


