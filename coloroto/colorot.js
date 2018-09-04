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
	    console.log(cmb.length);
	    var t = 1 - (10 / cmb.length);
	    console.log(t);
	    var i = 1;
	    while(a = cmb.next()) {
		var l = _.chain(a).uniq().size()
		if (l > 0) {
		    if (Math.random() > 0) {
			var b = _.shuffle(v.blocks);
			var id = 'svg' + i;
			
			var img = v.img;

			console.log(img);
			b.forEach(function(e){
			    var g = a.shift();
			    var r = new RegExp(e, 'gi');
			    img = img.replace(r, g);
			    a.push(g);
			});
			
			img = img.replace(/\.st/g, '#' + id + ' .st')
			var s = cw_template({ id: id, svg: img, swatches: _.uniq(a) })
			$('#output').append(s);

			// $('#' + id).append('<div class="icons"><i class="fas fa-trash-alt"></i><i class="fas fa-heart"></i></div>')
			i++;
		    }
		}
		if (i > 100) break;
	    };
	    $('.fa-trash-alt').click(function(e){
		console.log('trash');
		$(e.target).parents('div.cw').fadeOut()
	    })
	    $('.fa-heart').click(function(e){
		console.log('like');
		$(e.target).parents('div.cw').toggleClass('liked')
		$(e.target).css('color', 'Crimson')
	    })
	}
    });
})
