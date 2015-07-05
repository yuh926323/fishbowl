function Region(index, x, y, width, height, layer){
	this.region = {
		index	:	index,		//索引值
		x	:	x,				//區域左上角起始點 x
		y	:	y,				//區域左上角起始點 y
		height	:	height,		//長
		width	:	width,		//寬
		layer	:	layer		//圖層順序，數字越低表示越底層
	};
	this.p1 = {
		x	:	x,
		y	:	y
	};
	this.p2 = {
		x	:	x + width,
		y	:	y
	};
	this.p3 = {
		x	:	x,
		y	:	y + height
	};
	this.p4 = {
		x	:	x + width,
		y	:	y + height
	};
}
Region.prototype.move = function(x1, y1){
	this.region.x = x1;
	this.region.y = y1;
	this.update();
}
Region.prototype.update = function(){
	this.p1.x = this.region.x;					this.p1.y = this.region.y;
	this.p2.x = this.region.x+this.region.width;this.p2.y = this.region.y;
	this.p3.x = this.region.x;					this.p3.y = this.region.y+this.region.height;
	this.p4.x = this.region.x+this.region.width;this.p4.y = this.region.y+this.region.height;
}
Region.prototype.isset = function(x, y) {	//傳入滑鼠座標，若是在區域內回傳真，否則回傳假
	var p1 = this.p1;
	var p2 = this.p2;
	var p3 = this.p3;
	var p4 = this.p4;
	if(x > p1.x && y > p1.y){ // p1
		if(x < p2.x && y > p2.y){ // p2
			if(x > p3.x && y < p3.y){ // p3
				if(x < p4.x && y < p4.y){ // p4
					return true;
	}}}}
	return false;
}
Region.prototype.getIndex = function(){
	return this.region.index;
}
Region.prototype.getLayer = function(){
	return this.region.layer;
}