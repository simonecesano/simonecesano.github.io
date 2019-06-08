var token = "pk.eyJ1Ijoic2ltb25lY2VzYW5vIiwiYSI6ImNqdDR0eHY0cDA2cm80M255dmR6OHk5N3kifQ.GgSBPOLgJkbgvtOYQebzpA"
var mymap;

var attr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
    'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

var parseCoord = function(s) {
    var sign = s.match(/[EN]$/) ? +1 : -1;
    var coord = s.split(/[^\d\w\.]+/);
    return sign * (parseFloat(coord[0]) + parseFloat(coord[1] / 60) + parseFloat(coord[2] / (60*60)));
}

var refresh = function(json) {
    $.get(json, function(d){
	d = d.filter(e => {
	    return true
	}).map(e => {
	    // e.longitude = parseCoord(e.lon)
	    // e.latitude = parseCoord(e.lat)
	    e.longitude = e.lon
	    e.latitude  = e.lat
	    return e
	});
	
	var c = d[0]

	console.log(mymap);
	if (!mymap) { mymap = L.map('mapid') }
	mymap.setView([c.latitude, c.longitude ], 13)
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: attr,
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: token
	}).addTo(mymap)
	
	d.forEach(e => {
	    try {
		var marker = L.marker([e.latitude, e.longitude]).addTo(mymap);
		// var img = e.img.match(/N\/A/) ? '' : `<br /><img src="${e.img}">`
		marker.bindPopup(`${e.name}<br />${e.street}`)
	    } catch (err){
		console.log(err);
		console.log(JSON.stringify(e));
	    }
	})
    })
}

window.onhashchange = function(e){
    var json = location.hash.replace(/^#/, '' ) + '.json';
    refresh(json);
}

$(function(){
    refresh(location.hash.replace(/^#/, '' ) + '.json');
})
