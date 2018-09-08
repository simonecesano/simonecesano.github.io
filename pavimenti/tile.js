window.onload = function(){
    // console.log('loaded');
    var tilables = document.querySelectorAll('[data-tile]');
    tilables.forEach(function(e, i){
	var t = e.getAttribute('data-tile').split(/\s+/);
	// console.log(e);
	// console.log(t);
	var parent = e.parentNode;
	var size = {}; size.x = t[2]; size.y = t[3];
	for (x = 0; x < t[0]; x++) {
	    for (y = 0; y < t[1]; y++) {
		var cloned = e.cloneNode();
		var transform = cloned.getAttribute('transform')
		if (transform == null){
		    transform = 'translate(0 0)'
		}
		var m = transform.match(/translate\((\d+)\s+(\d+)\)/);
		var trasl = {};

		trasl.x = parseInt(m[1]); trasl.y = parseInt(m[2])
		trasl.x += size.x * x; trasl.y += size.y * y;
		transform = transform.replace(/translate\((\d+)\s+(\d+)\)/, ['translate(', trasl.x, trasl.y, ')'].join(' '));
		cloned.setAttribute('transform', transform)
		parent.appendChild(cloned);
		// console.log(x, y, transform, trasl);
	    }
	}
	e.remove()
    })
}
