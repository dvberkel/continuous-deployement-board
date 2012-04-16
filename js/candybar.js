(function($, undefined){
    var ProjectModel = Backbone.Model.extend({
	defaults: {owner: "travis-ci", repository: "travis-ci"}
    });

    var BuildModel = Backbone.Model.extend({});

    var Builds = Backbone.Collection.extend({
	template: _.template("http://travis-ci.org/<%= owner %>/<%= repository %>/builds.json?callback=?"),
	project: new ProjectModel(),
	model: BuildModel,

	initialize: function(models, options) {
	    options = options || {project: new ProjectModel};
	    this.project = options.project;

	    this.project.bind("change", function(){
		this.fetch();
	    }, this);
	},

	sync: function(method, model){
	    var collection = this, project = collection.project;
	    if (method == 'read') {
		$.getJSON(this.template(this.project.toJSON()), function(data){
		    collection.reset();
		    var repository = project.get('repository');
		    var owner = project.get('owner');
		    _.each(data, function(build){
			build.repository = repository;
			build.owner = owner;
			model.add(build);
		    });
		});
	    }
	}
    });

    var BuildsView = Backbone.View.extend({
	template: _.template("<tr class='status-<%= result %>'><td><a href='http://travis-ci.org/#!/<%= owner %>/<%= repository %>/builds/<%= id %>'><%= number %></a></td><td><a href='https://github.com/<%= owner %>/<%= repository %>/commit/<%= commit %>'><%= commit %></a></td></tr>"),

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
	var projectModel = new ProjectModel({owner: "dvberkel", repository: "ScoreCard"});
	var builds = new Builds([],{project: projectModel});
	builds.fetch();
	var buildsView = new BuildsView({el: $("#builds"), model: builds});
	$("#repository").change(function(){
	    var repository = $(this).val();
	    projectModel.set({repository: $(this).val()});
	});
    });
})( jQuery );