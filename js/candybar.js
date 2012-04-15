(function($, undefined){
    var ProjectModel = Backbone.Model.extend({
	defaults: {owner: "travis-ci", repository: "travis-ci"}
    });

    var BuildModel = Backbone.Model.extend({});

    var Builds = Backbone.Collection.extend({
	template: _.template("http://travis-ci.org/<%= owner %>/<%= repository %>/builds.json?callback=?"),
	model: BuildModel,

	sync: function(method, model){
	    var project = new ProjectModel();
	    if (method == 'read') {
		$.getJSON(this.template(project.toJSON()), function(data){
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