(function($, undefined){
    var BuildModel = Backbone.Model.extend({});

    var Builds = Backbone.Collection.extend({
	model: BuildModel
    });

    var BuildsView = Backbone.View.extend({
	template: _.template("<tr><td><%= number %></td><td><%= commit %></td><td><%= status %></td></tr>"),

	initialize: function(){
	    _.bindAll(this, 'render');

	    this.render();
	},

	render: function(){
	    var element = $(this.el), template = this.template;
	    element.empty();
	    this.model.each(function(model){
		element.append(template(model.toJSON()));
	    });
	}
    });

    $(function(){
	var builds = new Builds();
	builds.add({number: 37, commit: 51, status: 0});
	builds.add({number: 34, commit: 35, status: 0});
	var buildsView = new BuildsView({el: $("#builds"), model: builds});
    });
})( jQuery );