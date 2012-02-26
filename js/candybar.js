(function($, undefined){
    var BuildModel = Backbone.Model.extend({});

    var Builds = Backbone.Collection.extend({
	model: BuildModel,

	sync: function(method, model){
	    if (method == 'read') {
		$.getJSON("http://travis-ci.org/dvberkel/ScoreCard/builds.json?callback=?", function(data){
		    _.each(data, function(build){
			model.add(build);
		    });
		    console.log("finished");
		});
	    }
	}
    });

    var BuildsView = Backbone.View.extend({
	template: _.template("<tr><td><%= number %></td><td><%= commit %></td><td><%= result %></td></tr>"),

	initialize: function(){
	    _.bindAll(this, 'render');

	    this.model.bind("add",function(){
		this.render();
	    },this);

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
	builds.fetch();
	var buildsView = new BuildsView({el: $("#builds"), model: builds});
    });
})( jQuery );