define(function (require) {
    return Ember.Controller.extend({
        init: function () {
            var context = this;
            this.get('storage').on('get_' + this.get('key'), function (output) {
                var data = [];

                for (var index = 0; index < output.data.length; ++index) {
                    data.push(Ember.Object.create({
                        index: index,
                        selected: false,
                        content: output.data[index]
                    }));
                }

                output.data = data;
                context.set('snapshot', output);
            });
        },
        actions: {
            filter: function () {    
                this.get('storage').filter(this.get('key'), this.get_filtering());
            },
            sort: function (key) {
                var sortering = this.get('snapshot.sortering');

                this.get('storage').sort(this.get('key'), {
                    key: key,
                    asc: sortering.key === key ? !sortering.asc : true
                });
            },
            change_page_size: function () {
                this.get('storage').change_page_size(this.get('key'), this.get('snapshot.page_size'));
            },
            to_page: function (index) {
                this.get('storage').to_page(this.get('key'), index);
            },
            select_item: function (item) {
                var selection = this.get('selection');
                if (selection) {
                    selection.set('selected', false);
                }
                
                item.set('selected', true);
                this.set('selection', item);
            }
        },
        is_empty: function () {
            var total = this.get('snapshot.total');
            return (total === undefined || total === 0);  
        }.property('snapshot')
    })
});