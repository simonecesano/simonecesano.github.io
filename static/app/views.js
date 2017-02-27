var BookmarkView = Backbone.View.extend({
    bookmark_function: Handlebars.compile($('#bookmark_template').html()),
    bookmark_template: function(e){ return this.bookmark_function(e) },

    initialize: function(){ },

    render: function(){
	var host = (new URI(this.model.get('url'))).host()
	// // console.log(host);
	this.$el.html(this.bookmark_template(this.model.toJSON()));
	return this;
    }
});

var BookmarksView = Backbone.View.extend({
    el: 'div#bookmarks',
    initialize: function(c){
	this.collection = c
	// this.render()
    },
    render: function(){
	var bs = this;
	// console.log('bv render')
	bs.$el.empty()
	this.collection.each(function(e, i){
	    bs.$el.append((new BookmarkView({ model: e })).render().el);
	})
    }
})

var TagView = Backbone.View.extend({
    tag_function: Handlebars.compile($('#tag_template').html()),
    tag_template: function(e){ return this.tag_function(e) },
    initialize: function(){ },
    render: function(){
	this.$el.html(this.tag_template(this.model.toJSON()));
	return this;
    }
});



var TagsView = Backbone.View.extend({
    el: 'div#bookmarks',
    initialize: function(c){
	this.collection = c
	// this.render()
    },
    render: function(){
	var bs = this;
	bs.$el.empty();
	this.collection.each(function(e, i){
	    bs.$el.append((new TagView({ model: e })).render().el);
	})
    }
})
