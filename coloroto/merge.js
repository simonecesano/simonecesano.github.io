// PDFDocument.prototype.addSVG = function(svg, x, y, options) {
//     return SVGtoPDF(this, svg, x, y, options), this;
// };

$(function(){
    $('#saveb').click(function(e){
	var s = document.querySelector('.cw.liked svg').cloneNode();
	var bb = $(s).attr('viewBox').split(/\s+/);
	// s.innerHTML = '';
	var t = $('.cw svg').length;
	
	var g = new Grid(bb[2], bb[3], t, 'sq', 10, 10);
	var p = g.positions(0, 0);
	
	s.setAttribute('viewBox', g.bbox().join(' '));
	s.setAttribute('width',  g.bbox()[2] + 'px');
	s.setAttribute('height', g.bbox()[3] + 'px');
	
	$('.cw.liked svg').each(function(i, e){
	    var c = p.shift();
	    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	    
	    g.setAttribute('id', $(e).parent().attr('id'))
	    g.setAttribute('transform', [ 'translate(', c[0], ' ', c[1], ')' ].join(''));
	    
	    $(e).children().each(function(i, e){
		var n = e.cloneNode(true)
		console.log(n);
		$(n).find('*').each(function(i, e){
		    if (e.hasAttributes()) {
			[].slice.call(e.attributes).forEach(a => {
			    if (a.name.match(/inkscape/)) {
				console.log(a.name);
				e.removeAttribute(a.name);
			    }
			})
		    }
		});
		g.append(n);
	    })
	    s.append(g)
	})

	console.log(s);
	console.log(s.activeElement);
	console.log(s.getElementsByTagName);	

	var doc = new PDFDocument;
	doc.addSVG(s, 0, 0, {useCSS:true})
	
	var svg_filename = 'randomshoes' + '-' + Math.random().toString(36).substring(7) + '-' + moment().format('YYYYMMDDHHMM') + '.svg';

	let stream = doc.pipe(blobStream());
	stream.on('finish', function() {
	    // let blob = stream.toBlob('application/pdf');
	    // saveAs(blob, svg_filename.replace(/svg$/i, 'pdf'));
	});
	doc.end();

	
	var blob = new Blob([s.outerHTML], {type: "image/svg+xml"});
	saveAs(blob, svg_filename);
    })
})

// $(function(){
//     $.get('./rough.svg', function(d){
// 	$('#content').html(d.activeElement);
// 	$('#makepdf').click(function(e){
// 	    console.log('here');
// 	    var doc = new PDFDocument;
// 	    doc.addSVG($('#content').html(), 0, 0, {useCSS:true})
// 	    let stream = doc.pipe(blobStream());
// 	    stream.on('finish', function() {
// 		let blob = stream.toBlob('application/pdf');
// 		saveAs(blob, "rough.pdf");
// 	    });
// 	    doc.end();
// 	})
//     })
// })
