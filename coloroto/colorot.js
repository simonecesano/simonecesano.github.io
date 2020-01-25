var v = { palette: [], blocks: [], img: "" };
$(function(){

    const db = new Dexie('coloroto');

    db.version(1).stores({
	objects: 'object', // value is not indexed
	colors: 'hex, name'
    });

    db.objects.get('blocks').then(function (blocks) {
	loadBlocks(blocks.text);
    })
    db.objects.get('palette').then(function (palette) {
	loadPalette(palette.text);
    })
    
    

    if (!window.navigator.userAgent.match(/Chrome/)) {
	// alert browser not supported
	$('#browser_not_supported').modal();
    } else {
	navigator.permissions.query({name: 'clipboard-read'})
	    .then(function(result) {
		console.log(result.state);
		if (result.state == "granted" || result.state == "prompt") {
		} else {
		    // alert clipboard permissions
		    $('#enable_clipboard').modal();
		}
	    })
	    .catch(function(e){
		console.log(e);
	    });
    }

    
    var cw_template = Handlebars.compile(document.getElementById("cw-template").innerHTML);
    $('#clearb').click(function(e){
	$('#output').html('');
    })

    var palette_template = Handlebars.compile(document.getElementById("palette-template").innerHTML);
    var loadBlocks = function(text) {
	$('#img').html(text)
	var m = text.match(/fill:#[0-9a-f]{6,6}|fill="#[0-9a-f]{6,6}/ig)
	    .map(function(e){ return e.replace(/fill:/g, '').replace(/fill="/g, '') });
	m = _.uniq(m);
	// return m;
	v.blocks = m;
	v.img = text;
	
	$('#blocks').html(palette_template({ swatches: m }))
	$('#blocks .swatch').on('click', function(e){
	    $(e.target).parent().toggleClass('selected');
	})
    }
    var loadPalette = function(text) {
	var m = text.match(/fill:#[0-9a-f]{6,6}|fill="#[0-9a-f]{6,6}/ig)
	    .map(function(e){ return e.replace(/fill:/g, '').replace(/fill="/g, '') });
	m = _.uniq(m);
	v.palette = m;
	$('#palettes').html(palette_template({ swatches: m }))
	$('#palettes .swatch').on('click', function(e){
	    $(e.target).parent().toggleClass('selected');
	})
    }

    
    $('#blockb').click(function(e){
	navigator.clipboard.readText()
	    .then(text => {
		db.objects.put({object: "blocks", text: text}).then (function(){
		    return db.objects.get('blocks');
		}).then(function (blocks) {
		    loadBlocks(blocks.text);
		})
	    })
	    .catch(err => {
		console.error('Failed to read clipboard contents: ', err);
	    });
    })

    $('#paletteb').click(function(e){
	navigator.clipboard.readText()
	    .then(text => {
		db.objects.put({object: "palette", text: text}).then (function(){
		    return db.objects.get('palette');
		}).then(function (palette) {
		    loadPalette(palette.text);
		})
	    })
	    .catch(err => {
		console.error('Failed to read clipboard contents: ', err);
	    });
    })

    // ------------------------------------
    // create combinations
    // ------------------------------------

    $('#combinb').click(function(e){
	v.blocks = $('#blocks .caption')
	    .filter(function(i, e){ return !($(e).parent().hasClass('selected')) })
	    .map(function(i, e){ return $(e).html() }).get()
	
	v.palette = $('#palettes .caption')
	    .filter(function(i, e){ return !($(e).parent().hasClass('selected')) })
	    .map(function(i, e){ return $(e).html() }).get()

	console.log(v);

	if (v.palette.length) {
	    cmb = Combinatorics.baseN(_.shuffle(v.palette), 4);
<<<<<<< HEAD
	    // var t = 1 - (10 / cmb.length);
=======
	    var t = 1 - (10 / cmb.length);
		console.log(cmb.length + " potential combinations");
	    console.log(t);
>>>>>>> 0faf5cf798f6da31e6d41d7ca072b5d33cb3a1eb
	    var i = 1;

	    var seen = {};
	    
	    while(a = cmb.next()) {
		var l = _.chain(a).uniq().size()

		// --------------------------------
		// minimum number of colors
		// --------------------------------
		if (l > 2) {

		    // --------------------------------
		    // do not output every combination
		    // --------------------------------
		    if (Math.random() > 0) {
			var b = _.shuffle(v.blocks);
			var img = v.img;

			seen[b.join('::')] = seen[b.join('::')] ? seen[b.join('::')] + 1 : 1;
			var id = 'svg' + md5(b.join('::')); 
			// var id = 'svg' + i;
			b.forEach(function(e){
			    
			    var g = a.shift();
			    var r = new RegExp(e, 'gi');
			    console.log(e, g);
			    img = img.replace(r, g);
			    a.push(g);
			});
			
			img = img.replace(/\.st/g, '#' + id + ' .st');
			


			(new Promise(function(resolve, reject) {
			    var s = cw_template({ id: id, svg: img, swatches: _.uniq(a) })
			    $('#output').append(s);
			    resolve('foo');
			})).then(e => {
			    $('#output').hide().show()
			}).catch(e => {

			});

			i++;
		    }
		}
		if (i > 40) break;
	    };

	    $('.cw svg path').each(function(i, e){
		var styleObj = getComputedStyle(e);

		for (var i = styleObj.length; i--;) {
		    var nameString = styleObj[i];
		    var cssValue = styleObj.getPropertyValue(nameString)
		    if (nameString.match(/^fill$/i) && cssValue.match(/^rgb/)) {
			var rgb = cssValue.replace(/rgb\s*\(/, '').replace(/\)/, '').split(/,\s*/)
			rgb = chroma(rgb);
			var l = rgb.get('hsl.l');
			if (l < 0.2) {
			    $(e).attr('stroke', '#333333');
			}
		    }
		}		
	    })
	    
	    $('.fa-trash-alt').click(function(e){
		$(e.target).parents('div.cw').fadeOut()
	    })

	    $('.fa-heart').click(function(e){
		$(e.target).css('color', 'Crimson')
		el = $(e.target).parents('div.cw').toggleClass('liked').detach()
		$('#likes').append(el);
	    })
	}
    });
})
