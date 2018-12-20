var FooDB = function(client, opts) {
    this.client = client
}

FooDB.prototype.connect = function(id, range) {
    var f = this;
    f.id    = id;
    f.range = range;
    
    return f.client.sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: range,
    }).then(function(response) {
	f.values = response.result.values;
	f.headers = f.values.shift();
	f.headerCols = {}; f.headers.forEach(function(e, i){ f.headerCols[e] = i + 1 });
	
	f.values = f.values.map(function(e, i){
	    var o = {};
	    f.headers.forEach((h, i) => {
		o[h] = e[i];
	    })
	    // console.log(o);
	    return o;
	})
    })
    .catch(function(e){
	console.log(e);
    })
}

FooDB.prototype.filter = function(a){
    return this.values.filter(function(e, i){ return a(e, i) });
}

FooDB.prototype.indexes = function(a){
    var idx = []
    this.values.forEach(
	function(e, i){ if (a(e, i)) { idx.push(i) } }
    );
    return idx;
}

FooDB.prototype.rows = function(a) {
    return this.indexes(a).map(function(e){ return e + 2 })
}

FooDB.prototype.ranges = function(where) {
    var f = this; var r = [ ];
    
    f.rows(where).forEach(function(e, i){
	if (r.length && r[r.length - 1][1] == e - 1 ) { r[r.length - 1][1] = e } else { r.push([e, e]) }
    })

    return r.map(function(k, i) {
	var range = f.sheet() + '!' + f.cols().map(function(e, j){ return e + k[j]; }).join(':');
    	return { range: range, length: 1 + r[i][1] - r[i][0] }
    })
}

FooDB.prototype.update = function(values, where){
    var f = this;
    var val = f.objToValues(values);

    var ranges = f.ranges(where);
    
    var ups = ranges.map(function(e, i){
	var v = [ ]; v.length = e.length; v.fill(val, 0, e.length);
    	return h = f.client.sheets.spreadsheets.values.update(
    	    { spreadsheetId: f.id, range: e.range, valueInputOption: 'USER_ENTERED' },
    	    { values: v }
    	).getPromise()
    });

    return Promise.all(ups).then(function(e){ return e.map(t => { return t.result }) })
}

FooDB.objToWhere = function(obj) {
    var k = Object.keys(obj);
    return function(e, i) {
	return function(v){
	    return k.every(function(j){ return v[j] == obj[j] })
	};
    }
}

FooDB.prototype.objToValues = function(obj){
    // takes an obj and returns an array;
    var f = this;
    var r = [];
    Object.keys(obj)
	.filter(function(k){ return f.headerCols[k] })
	.forEach(function(k, i){
	    r[f.headerCols[k] - 1] = obj[k]
	})
    return r;
}

FooDB.numToCol = function(num) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
	ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
}

FooDB.colToNum = function(col){
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
    var val = col.toUpperCase();

    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
	result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }
    return result;
}

FooDB.prototype.sheet = function(){
    return this.range.replace(/!.+/, '');
}

FooDB.prototype.cols = function(nums, all){
    var c = this.range
	.replace(/.+?!/, '')
    	.replace(/[^a-z:]/i, '')
	.split(':')
	.map(function(e){ return e })
    return c;
}


FooDB.where = function(where){
    // if where is a function, return it
    // if where is a series of numbers, update those rows
    // if where is an obj, return the function 
}
