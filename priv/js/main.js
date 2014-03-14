(function(root) {
	curl({baseUrl: '/js'},
		["application"], 
		function (application) {
            var app = Ember.Application.create(application);

            app.Router.map(function() {
            	this.resource('members', { path: '/'});
            });

            root['Members'] = app;
        }
    );
})(this); 