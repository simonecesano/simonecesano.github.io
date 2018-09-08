window.onload = function(){
    document.querySelectorAll('line').forEach(function(e, i){
	var b = e.getBoundingClientRect();
	var r = (b.width / b.height);
	if ((r < 1.3) && (r > 0.7)) {
	    e.remove()
	}
    });
}
