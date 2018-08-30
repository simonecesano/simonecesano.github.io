CalcLine = function(text) {
    // this.text = text;

    // var t = this.text
    var item = {};
    var t = text
    
    // item.original_line = '' + this.text;
    item.line = text;
    
    item.purpose = t.match(/=>/) ? t.replace(/.+?\s=>\s/, '').replace(/\s*=*$/, '') : '';
    
    // drivers
    var r = new RegExp('\\b(-?\\d+\\.?\\d*)\\s+\\@([0-9a-zA-Z_]+)\\b', 'gi');
    item.drivers = [];

    // console.log(r.exec(t));
    
    while (m = r.exec(t)) {
	// console.log(m);
	var k = { name: m[2], amount: m[1] }
	item.drivers.push(k);
    }
    
    // multiplication
    t = t.replace(/\sx\s|\s@\s/gi, ' * ')
    // thousands
    t = t.replace(/\b([\d\.]+)k\b/i, " $1" + ' * ' + Math.pow(10, 3));
    // millions
    t = t.replace(/\b([\d\.]+)M\b/,  " $1" + ' * ' + Math.pow(10, 6));
    // billions
    t = t.replace(/\b([\d\.]+)B\b/, " $1" + ' * ' + Math.pow(10, 9));
    // percentage
    t = t.replace(/\b([\d\.]+)\%/i, " $1" + ' * 0.01 ');
    // not a number
    t = t.replace(/[^\d\*\.\+\/\(\)]+/g, ' ');

    // readable numbers
    // item.line = item.line.replace(/0{9,9}\b/g, 'B').replace(/0{6,6}\b/g, 'M').replace(/0{3,3}\b/g, 'k')
    // console.log(readable(item.line));
    item.line = readable(item.line)
    
    // fix spaces
    item.calc = t.replace(/^\s+/g, ' ');
        
    try { item.value = eval(item.calc.toLocaleString()) } catch (e) { item.value = ''; item.err = e }
    return item;
}

var readable = function(t) {
    var s = function(string, power, suffix) {
	var n = parseFloat(string)
	console.log(string);
	console.log(n);
	var f = Math.floor(Math.log10(n));

	if (f >= 9) {
	    return Math.round(n /  Math.pow(10, 9)) + 'B'; 
	} else if (f >= 6) {
	    return Math.round(n /  Math.pow(10, 6)) + 'M'; 

	} else if (f >= 3) {
	    return Math.round(n /  Math.pow(10, 3)) + 'k'; 
	} else {
	    return Math.round(n * 100) / 100;
	}
	
	// return (Math.round(parseFloat(string) / Math.pow(10, power - 1)) / 10).toString() + suffix
	// return string
    }

    console.log(t);
    return t.replace(/\b(\d+\.*\d*)\b/g, function(match, p1) { return s(p1, 0, 'B') });
	// 
	// .replace(/\b(\d{9,})\b/g,  function(match, p1) { return s(p1, 9, 'B') })
    	// .replace(/\b(\d{6,8})\b/g, function(match, p1) { return s(p1, 6, 'M') })
    	// .replace(/\b(\d{3,5})\b/g, function(match, p1) { return s(p1, 3, 'k') });
}

Calc = function() {
    this.lines = [];
    this.subtotal = 0;
    this.total = 0;
    return this;
}

Calc.prototype.append = function(text) {
    //----------------------------------------------------------------
    // this needs to make sure that the original text is preserved
    //----------------------------------------------------------------
    if (this.lines.length) {
	text = text.replace(/\_+/g, this.lines[this.lines.length - 1].value)
    } else {
	text = text.replace(/\_+/g, 1)
    }
    
    this.lines.push(CalcLine(text))

    // line ends with a '='
    if (text.match(/\w\s*=\s*$/)) {
	this.subtotal = this.subtotal + this.lines[this.lines.length - 1].value
	this.lines[this.lines.length - 1].subtotal = this.subtotal;
    }

    // line is '='
    // could be that it begins with '='
    var m
    this.lines[this.lines.length - 1]["class"] = "";

    if (m = text.match(/^\s*={1,1}(.*)/)) {
	text.replace(/\s*=+/, '')
	var t = m[1].length ? m[1] : ' subtotal'
	this.lines[this.lines.length - 1] = CalcLine('' + this.subtotal + t);
	this.lines[this.lines.length - 1]["class"] = "subtotal";
	this.total = this.total + this.subtotal;
	this.subtotal = 0;
    } 

    // line is '=='
    if (m = text.match(/^\s*={2,2}(.*)/)) {
	text.replace(/\s*=+/, '')
	var t = m[1].length ? m[1] : ' total'
	this.lines[this.lines.length - 1] = CalcLine('' + this.total + t);
	this.lines[this.lines.length - 1]["class"] = "total";
    } 
    if (m = text.match(/^#/)) {
	this.lines[this.lines.length - 1]["class"] = "header";
    }
}

Calc.prototype.drivers = function() {
    var drivers = {}
    this.lines.forEach(function(e, i){
	e.drivers.forEach(function(d, j){
	    drivers[d.name] = drivers[d.name] ? drivers[d.name] : 0;
	    drivers[d.name] = drivers[d.name] + parseFloat(d.amount)
	})
    })
    return drivers;
}

Calc.prototype.markdown = function(){
    return this.lines
	.map(function(e, i){
	    var l = e.line
		.replace(/=>/, '&rarr;')
		.replace(/\s*=\s*$/, '')	    
	    if (e.class.match(/total/)) {
		return "\n__" + l + "__\n"
	    } else {
		return l
	    }
	})
	.join("\n")
}

// module.exports = CalcLine
// module.exports = Calc

/*

- numbers followed by k, M, B get replaced by same number multiplied by thousand, million, billion respectively: 23k results in 23000
- numbers followed by % get replaced by same number divided by 100
- " @ " , " x " (watch surrounding spaces) get replaced by multiplication "12 @ 15" results in 12 * 15 => 180 
- '_' gets replaced by the result of the previous line
- a line ending in '=' gets added to the subtotal
- a line beginning in '=' outputs the running subtotal and resets it
- a line beginning in '==' outputs the grandtotal


*/
