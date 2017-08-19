var bs; var ts; var tv; var bv;
    
$.get('tags.json', function(d){
    // console.log(d);
    var t = new TagsDict;
    _.each(d, function(e){ t.addBookmark(e) })
    ts = new Tags(t.tags())
    
    bs = new Bookmarks(d);

    tv = new TagsView(ts);
    bv = new BookmarksView(bs);
    var router = new BookmarkRouter;
    
    Backbone.history.start()
}, 'json')
