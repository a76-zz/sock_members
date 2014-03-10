(function(root) {
	curl(["application"], 
		function (config, app) {
            var app = Ember.Application.create(application);

            app.Router.map(function() {
            	this.resource('members', { path: '/'});
            });

            root['Members'] = app;
        }
    );
})(this); 