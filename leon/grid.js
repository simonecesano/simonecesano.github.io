function Grid(width, height, cols, rows, h_gutter, v_gutter) {
    if (rows == 'sq') {
	var t = cols;
	cols = Math.ceil(Math.sqrt(cols));
	rows = Math.ceil(t / cols);
    }
    
    this.width = width
    this.height = height
    this.cols = cols
    this.rows = rows
    this.h_gutter = h_gutter
    this.v_gutter = v_gutter
    
    return this;
};


Grid.prototype.sequence = function(){
    var seq = [];
    
    for (x = 0; x < this.cols; x++) {
	for (y = 0; y < this.rows; y++) {
	    seq.push([x, y])
	}
    }
    return seq
}

Grid.prototype.positions = function(x_offset, y_offset){
    var pos = []
    x_offset = x_offset ? x_offset : 0;
    y_offset = y_offset ? y_offset : 0;    

    var g = this
    var seq = this.sequence();
    seq.forEach(function(e, i){
	pos.push([
	    (g.width * e[0]) + (g.h_gutter * e[0]) + x_offset,
	    (g.height * e[1]) + (g.v_gutter * e[1]) + y_offset
	])
    })
    return pos
}

Grid.prototype.bbox = function(){
    return [
	0, 0,
	this.width * this.cols + this.h_gutter * (this.cols - 1),
	this.height * this.rows + this.v_gutter * (this.rows - 1)
    ]
}
