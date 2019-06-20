var token = "pk.eyJ1Ijoic2ltb25lY2VzYW5vIiwiYSI6ImNqdDR0eHY0cDA2cm80M255dmR6OHk5N3kifQ.GgSBPOLgJkbgvtOYQebzpA"
var mymap;

// var colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
var colors = ['Crimson', 'darkred', 'Maroon', 'OliveDrab', 'darkgreen', 'DarkOrange', 'Teal', 'Indigo', 'DarkGoldenrod'];

// var icons = {
//     "pizzerie": "pizza",
//     "librerie": "book-open-variant",
//     "pasticcerie": "coffee",
//     "mergellina": "silverware-fork-knife",
//     "trattorie": "silverware-fork-knife",
//     "friggitorie": "pot",
//     "vestiti_usati": "tshirt-crew",
// }

var icons = {
    "pizzerie": "fire",
    "librerie": "book",
    "pasticcerie": "coffee",
    "mergellina": "cutlery",
    "trattorie": "cutlery",
    "friggitorie": "beer",
    "vestiti_usati": "shopping-bag",
    "sneakers": "shopping-bag"
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

var url = 'marker_clean_no.svg';
var request = new XMLHttpRequest();
request.open('GET', url, false);  // `false` makes the request synchronous
request.send(null);
var doc;

var domparser = new DOMParser();
if (request.status === 200) {
    doc = domparser.parseFromString(request.responseText, 'image/svg+xml')
} else {
    throw("could not load marker icon")
}


var changeIconColor = function(svgdoc, color) {

    color = chroma(color || 'DarkRed');

    var base = chroma(svgdoc.querySelector('[stop-color]').getAttribute('stop-color'));
    var [hb, sb, lb, ab] = base.hsl()
    var [hn, sn, ln, an] = color.hsl()
    svgdoc.querySelectorAll('[stop-color]').forEach(e => {
	var c = chroma(e.getAttribute('stop-color'));
	var [h1, s1, l1, a1] = c.hsl()

	var c = chroma.hsl( h1 - hb + hn, s1 - sb + sn, l1 - lb + ln, a1 - ab + an );
	e.setAttribute('stop-color', c.hex())
	      
    });
    var svg = (new XMLSerializer()).serializeToString(svgdoc.documentElement);
    var src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg);
    return src;
}

var icon = function (color) {

    var src = changeIconColor(doc, color);
    return new L.Icon({
	iconUrl: src,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
    })
};


var refresh = function(hash) {
    var json = hash.replace(/^#/, '' ) + '.json'
    
    $.get(json, function(d){
	d = d.filter(e => {
	    return !(e.lon === 'N/A') && !(e.lat === 'N/A') && e.lon && e.lat
	}).map(e => {
	    e.longitude = e.lon
	    e.latitude  = e.lat
	    return e
	});

	var colorLookup = {};
	Array.from(new Set(d.map(e => { return e.type || hash.replace(/#/, '') })))
	    .sort() // unique and sorted
	    .forEach(e => {
		colorLookup[e] = colors.shift();
		colors.push(colorLookup[e]);
	    })
	console.log(colorLookup);
	
	var c = d[0]
	if (!mymap) {
	    mymap = L.map('mapid')
	} else {
	    // console.log(mymap.getPane('markerPane').remove())
	    // console.log(mymap.getPane('markerPane').remove())
	}

	var colorMap = {};
	d.forEach(i => {
	    if (i.type && !colorMap[i.type]) {
		colorMap[i.type] = colors.shift()
	    }
	})
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
		var color = colorLookup[e.type];
		var marker = L.marker([e.latitude, e.longitude], { icon: icon(color) }).addTo(mymap);
		
		markers.push(marker);
		marker.bindPopup(template(e))
	    } catch (err){
		console.log(err);
	    }
	})
	var group = new L.featureGroup(markers);
	mymap.fitBounds(group.getBounds());
    })
}

window.onhashchange = function(e){
    refresh(location.hash);
}

$(function(){
    refresh(location.hash || '#all' );
})
