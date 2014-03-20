define(function(require) {
	var navigator = require('../core/navigator');

	return {
		__create: function (state, target) {
			var state = state || {},
			    target = target || {};

			state.key = 'members';
			state.get_filtering = function (context) {
				return {
					first_name_s: context.get('first_name')
				};
			};

			target = navigator.__create(state, target);
			return target;
		} 
	};
});