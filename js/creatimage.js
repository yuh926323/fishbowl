function CreatImage(src, rate, width, height, frame_x, frame_y, x, y, index)
{
	this.image = {						// 定義圖片資訊
		rate :			rate,				// 放大倍率
		width :			width,				// 寬度
		height :		height,				// 長度
		frame_x :		frame_x,			// x 軸的圖片有幾張
		frame_y :		frame_y,			// y 軸的圖片有幾張
		x :				x,
		y :				y,
		index :			index,
		image :			{},					// Image 物件
		imageFrame_x :	0,					// 填入 0 代表不需要開啟 Frame 功能
		imageFrame_y :	0					// 填入 0 代表不需要開啟 Face 功能
	};
	this.moveTo = {							// 這欄是用來針對寶物移動的
		x : 0,
		y : 0,
		times : 0,
		enable : false
	};
	this.image.image = new Image();
	this.image.image.src = src;
	this.region = new Region(this.image.index, this.image.x, this.image.y, this.image.width, this.image.height, 0);
}

CreatImage.prototype.move = function(x, y) {
	this.image.x = x;
	this.image.y = y;
	if(this.region != null) this.region.move(x, y);
}
CreatImage.prototype.draw = function(ctx) {
	if(this.image.width == 0) this.image.width = this.image.image.width;
	if(this.image.height == 0) this.image.height = this.image.image.height;
	if(this.image.rate == 0) this.image.rate = 1;
	if(this.moveTo.enable){
		this.region = null;
		var x_delta = (this.moveTo.x - this.image.x) / this.moveTo.times;
		var y_delta = (this.moveTo.y - this.image.y) / this.moveTo.times;
		if(this.moveTo.times > 0) this.moveTo.times--;
		this.image.x += x_delta;
		this.image.y += y_delta;
	}
	ctx.drawImage(this.image.image,
				(this.image.imageFrame_x * this.image.width),
				(this.image.imageFrame_y * this.image.height),
				this.image.width, this.image.height,
				this.image.x,
				this.image.y,
				Math.floor(this.image.width*this.image.rate),
				Math.floor(this.image.height*this.image.rate));
}
CreatImage.prototype.change_image = function(src) {
	this.image.image = null;
	this.image.image = new Image();
	this.image.image.src = src;
}
CreatImage.prototype.getImageWidth = function(){
	return this.image.width;
}
CreatImage.prototype.getImageHeight = function(){
	return this.image.height;
}
CreatImage.prototype.setAniFrameX = function(imageFrame_x){
	this.image.imageFrame_x = imageFrame_x;
}
CreatImage.prototype.setAniFrameY = function(imageFrame_y){
	this.image.imageFrame_y = imageFrame_y;
}
CreatImage.prototype.getX = function(){
	return this.image.x;
}
CreatImage.prototype.getY = function(){
	return this.image.y;
}