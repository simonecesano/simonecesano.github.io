$(function(){
    $('#saveb').click(function(e){
	var s = document.querySelector('.cw svg').cloneNode();
	var bb = $(s).attr('viewBox').split(/\s+/);
	// s.innerHTML = '';
	var t = $('.cw svg').length;
	
	var g = new Grid(bb[2], bb[3], t, 'sq', 10, 10);
	var p = g.positions(0, 0);
	
	s.setAttribute('viewBox', g.bbox().join(' '));
	s.setAttribute('width',  g.bbox()[2] + 'px');
	s.setAttribute('height', g.bbox()[3] + 'px');
	
	$('.cw svg').each(function(i, e){
	    var c = p.shift();
	    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	    
	    g.setAttribute('id', $(e).parent().attr('id'))
	    g.setAttribute('transform', [ 'translate(', c[0], ' ', c[1], ')' ].join(''));
	    
	    $(e).children().each(function(i, e){
		var n = e.cloneNode(true)
		g.append(n);
	    })
	    s.append(g)
	})
	var svg_filename = 'randomshoes' + '-' + Math.random().toString(36).substring(7) + '-' + moment().format('YYYYMMDDHHMM') + '.svg';
	
	var blob = new Blob([s.outerHTML], {type: "image/svg+xml"});
	saveAs(blob, svg_filename);
    })
})
