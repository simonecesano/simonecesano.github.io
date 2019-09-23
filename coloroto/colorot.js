var v = { palette: [], blocks: [], img: "" };
$(function(){
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

    $('#blockb').click(function(e){
	navigator.clipboard.readText()
	    .then(text => {
		$('#img').html(text)
		var m = text.match(/fill:#[0-9a-f]{6,6}|fill="#[0-9a-f]{6,6}/ig)
		    .map(function(e){ return e.replace(/fill:/g, '').replace(/fill="/g, '') });
		m = _.uniq(m);
		v.blocks = m;
		v.img = text;
  		var palette_template = Handlebars.compile(document.getElementById("palette-template").innerHTML);
		$('#blocks').html(palette_template({ swatches: m }))
		$('#blocks .swatch').on('click', function(e){
		    $(e.target).parent().toggleClass('selected');
		})
	    })
	    .catch(err => {
		console.error('Failed to read clipboard contents: ', err);
	    });
    })

    $('#paletteb').click(function(e){
	navigator.clipboard.readText()
	    .then(text => {
		var m = text.match(/fill:#[0-9a-f]{6,6}|fill="#[0-9a-f]{6,6}/ig)
		    .map(function(e){ return e.replace(/fill:/g, '').replace(/fill="/g, '') });
		m = _.uniq(m);
		v.palette = m;
  		var palette_template = Handlebars.compile(document.getElementById("palette-template").innerHTML);
		$('#palettes').html(palette_template({ swatches: m }))
		$('#palettes .swatch').on('click', function(e){
		    $(e.target).parent().toggleClass('selected');
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
	    var t = 1 - (10 / cmb.length);
		console.log(cmb.length + " potential combinations");
	    console.log(t);
	    var i = 1;

	    var seen = {};
	    
	    while(a = cmb.next()) {
		var l = _.chain(a).uniq().size()
		if (l > 0) {
		    if (Math.random() > 0) {
			var b = _.shuffle(v.blocks);
			
			var img = v.img;

			seen[b.join('::')] = seen[b.join('::')] ? seen[b.join('::')] + 1 : 1;
			console.log(b.join('::'), seen[b.join('::')] > 1);
			var id = 'svg' + md5(b.join('::')); 
			// var id = 'svg' + i;
			console.log(id);
			b.forEach(function(e){
			    
			    var g = a.shift();
			    var r = new RegExp(e, 'gi');
			    console.log(e, g);
			    img = img.replace(r, g);
			    a.push(g);
			});
			
			img = img.replace(/\.st/g, '#' + id + ' .st')
			var s = cw_template({ id: id, svg: img, swatches: _.uniq(a) })
			$('#output').append(s);

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
			// console.log(nameString);
			// console.log(cssValue);
			var rgb = cssValue.replace(/rgb\s*\(/, '').replace(/\)/, '').split(/,\s*/)
			rgb = chroma(rgb);
			var l = rgb.get('hsl.l');
			if (l < 0.2) {
			    // styleObj.setProperty('stroke', 'grey');
			    $(e).attr('stroke', '#333333');
			}
		    }
		    // styleObj.removeProperty(nameString);
		}		
	    })
	    
	    $('.fa-trash-alt').click(function(e){
		console.log('trash');
		$(e.target).parents('div.cw').fadeOut()
	    })
	    $('.fa-heart').click(function(e){
		console.log('like');
		$(e.target).css('color', 'Crimson')
		el = $(e.target).parents('div.cw').toggleClass('liked').detach()
		$('#likes').append(el);
	    })
	}
    });
})
