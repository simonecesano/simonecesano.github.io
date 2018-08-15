var v = { palette: [], blocks: [], img: "" };
$(function(){
    var cw_template = Handlebars.compile(document.getElementById("cw-template").innerHTML);
    $('#clearb').click(function(e){
	$('#output').html('');
    })
    $('#blockb').click(function(e){
	navigator.clipboard.readText()
	    .then(text => {
		$('#img').html(text)
		var m = text.match(/fill:(#[0-9a-f]{6,6})/ig).map(function(e){ return e.replace(/fill:/g, '') });
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
		var m = text.match(/fill:(#[0-9a-f]{6,6})/ig).map(function(e){ return e.replace(/fill:/g, '') });
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
			var s = cw_template({ id: id, svg: img, swatches: _.uniq(a) })
			$('#output').append(s);
			
			var css = $('#' + id + ' svg style').html();
			
			b.forEach(function(e){
			    var g = a.shift();
			    var r = new RegExp(e, 'gi');
			    css = css.replace(r, g);
			    a.push(g);
			});
			
			css = css.replace(/\.st/g, '#' + id + ' .st')
			$('#' + id + ' svg style').html(css);
			// $('#' + id).append('<div class="icons"><i class="fas fa-trash-alt"></i><i class="fas fa-heart"></i></div>')
			i++;
		    }
		    $('.fa-trash-alt').click(function(e){
			$(e.target).parents('div.cw').fadeOut()
		    })
		}
		if (i > 100) break;
	    };
	}
    });
})
