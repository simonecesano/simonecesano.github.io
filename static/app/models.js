// ---------------------------------------------------------------------
// bookmarks
// ---------------------------------------------------------------------

var Bookmark = Backbone.Model.extend({
    initialize: function(e){
	this.attributes.host = (new URI(this.get('url'))).host();
	this.attributes.title = this.attributes.title ? this.attributes.title : this.attributes.host
	this.attributes.tagString = this.attributes.tags
	this.attributes.tags = this.attributes.tags.split(/; /)
	this.attributes.date = moment(parseFloat(this.attributes.time) * 1000).format('DD-MM-YYYY')
    }
})

var Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    filterBy: function(attr, filter){
	var r = new RegExp('\\b' + filter + '\\b');
	console.log(r);
	var arr = this.filter(function(e) { return e.attributes[attr].match(r) })
	// console.log(arr.length)
	return new Bookmarks(arr);
    }
})

// ---------------------------------------------------------------------
// tags
// ---------------------------------------------------------------------
var Tag = Backbone.Model.extend({
    initialize: function(e){
    }
});

var Tags = Backbone.Collection.extend({ model: Tag })

var TagsDict = Backbone.Model.extend({
    defaults: { items: {} },
    addBookmark: function(b){
	var t = this;
	var tags = b.tags.split(/; /);
	_.each(tags, function(e, i){
	    if (!t.attributes.items[e]) { t.attributes.items[e] = { length: 0, time: '0' } }
	    t.attributes.items[e].length++;
	    t.attributes.items[e].time = t.attributes.items[e].time < b.time ?
		b.time :
		t.attributes.items[e].time;
	})
    },
    keys: function(){ var t = this; return _.keys(t.attributes.items) },
    tags: function(){
	var t = this;
	var keys = t.keys();
	var tags = _.map(keys, function(e, i){
	    return new Tag({
		tag: e,
		length: t.attributes.items[e].length,
		time: t.attributes.items[e].time,
		date: moment(parseFloat(t.attributes.items[e].time) * 1000).format('DD-MM-YYYY')
	    })
	})
	return tags;
    }
})
