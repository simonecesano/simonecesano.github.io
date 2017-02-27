var f, bf;

var BookmarkRouter = Backbone.Router.extend({
    routes: {
	'tags':                 'tags',
	'tags/:sort':           'tagsSorted',
	'bookmarks':              'bookmarks',
	'bookmarks/:tag':         'bookmarksFiltered',
	'bookmarks/:tag/:sortBy': 'bookmarksFiltered',
	'sorted/:sortBy':         'bookmarksSorted',
    },
    tags: function(){ tv.render() },
    tagsSorted: function(sortBy){
	if (sortBy === 'count') {
	    ts = ts.sortBy(function(e){ return -e.attributes.length })
	} else if (sortBy === 'date') {
	    ts = ts.sortBy(function(e){ return -e.attributes.time })
	} else {
	    ts = ts.sortBy(function(e){ return e.attributes[sortBy] })
	}
	ts = new Tags(ts);
	var tv = new TagsView(ts)
	tv.render()
    },

    bookmarks: function(){ bv.render() },
    bookmarksFiltered: function(filter, sortBy){
	
	bf = bs.filterBy('tagString', filter);
	if (sortBy === 'date') {
	    bf = bf.sortBy(function(e){ return -e.attributes.time })
	} else {
	    bf = bf.sortBy(function(e){ return e.attributes[sortBy] })
	}	
	bf = new Bookmarks(bf)

	var bv = new BookmarksView(bf);
	f = filter;
	bv.render()
    },
    bookmarksSorted: function(sortBy){
	this.navigate('bookmarks/' + f + '/' + sortBy, {trigger: true })
    }
})

