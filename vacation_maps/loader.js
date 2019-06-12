var token = "pk.eyJ1Ijoic2ltb25lY2VzYW5vIiwiYSI6ImNqdDR0eHY0cDA2cm80M255dmR6OHk5N3kifQ.GgSBPOLgJkbgvtOYQebzpA"
var mymap;

// var colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
var colors = ['red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpurple', 'cadetblue'];

var icons = {
    "pizzerie": "fire",
    "librerie": "book",
    "pasticcerie": "coffee",
    "mergellina": "cutlery",
    "trattorie": "cutlery",
    "friggitorie": "beer",
    "vestiti_usati": "shopping-bag",
}

var template = `
{{#if href}}
<a href="{{href}}">{{ name }}</a>
{{else}}
{{ name }}
{{/if}}<br />
{{#if street}}
{{ street }}
{{/if}}
{{#if img}}
<img src="{{img}}">
{{/if}}`
template = Handlebars.compile(template);

var markers = [];

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
	    return !(e.lon === 'N/A') && !(e.lat === 'N/A') && e.lon && e.lat
	}).map(e => {
	    e.longitude = e.lon
	    e.latitude  = e.lat
	    return e
	});
	
	var c = d[0]
	if (!mymap) {
	    mymap = L.map('mapid')
	} else {
	    // console.log(mymap.getPane('markerPane').remove())
	    // console.log(mymap.getPane('markerPane').remove())
	}

	var colorMap = {};
	d.forEach(i => { if (i.type && !colorMap[i.type]) {
	    colorMap[i.type] = colors.shift() } })
	console.log(colorMap);

	mymap.setView([c.latitude, c.longitude ], 13)
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: attr,
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: token
	}).addTo(mymap)

	markers.forEach(m => { m.remove() })
	
	d.forEach(e => {
	    try {
		var redMarker = L.AwesomeMarkers.icon({ icon: icons[e.type] || 'dot-circle-o', prefix: 'fa', markerColor: 'red' });
		var marker = L.marker([e.latitude, e.longitude], { icon: redMarker }).addTo(mymap);

		markers.push(marker);
		marker.bindPopup(template(e))
	    } catch (err){
		console.log(err);
		// console.log(JSON.stringify(e));
	    }
	})
	var group = new L.featureGroup(markers);
	mymap.fitBounds(group.getBounds());
    })
}

window.onhashchange = function(e){
    var json = location.hash.replace(/^#/, '' ) + '.json';
    refresh(json);
}

$(function(){
    refresh(location.hash.replace(/^#/, '' ) + '.json');
})
