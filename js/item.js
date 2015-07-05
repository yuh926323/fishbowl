function Item(type, loc, enable, price){
	this.item = {
		type	:	type,		//商品的類型
		loc		:	loc,		//商品的位置
		enable	:	enable,		//是否啟用商品
		price	:	price,		//價格
		frame	:	0,			//用來控制是 Enalbe, Disable ... etc
		image	:	{}			//用來存影像
	};
	this.item.image = new CreatImage(DEF_SHOP_ITEM_PATH[0][0], 1, 100, 100, 0, 0, this.item.loc*100, 0, loc);
}

Item.prototype.update = function(){
	this.item.image.draw(ctx);	 //先畫影像
	if(this.item.enable){
		this.item.image.change_image(DEF_SHOP_ITEM_PATH[this.item.type][this.item.frame]);
		if(this.item.price < 10000) var style = "16px ";
		else if(this.item.price < 100000) var style = "15px ";
		else if(this.item.price < 1000000) var style = "14px ";
		else var style = "13px ";
		setText( style+'Play', "rgba("+getCHex('00')+","+getCHex('00')+","+getCHex('00')+",.25)",
				"center", "bottom", "$"+this.item.price, this.item.image.getX()+52, this.item.image.getY()+98);
		setText( style+'Play', "rgba("+getCHex('f5')+","+getCHex('eb')+","+getCHex('3c')+",1.0)",
				"center", "bottom", "$"+this.item.price, this.item.image.getX()+50, this.item.image.getY()+96);
	}
	else{
		this.item.image.change_image(DEF_SHOP_ITEM_PATH[0][this.item.frame]);
	}
}
Item.prototype.setFrame = function(frame){
	this.item.frame = frame;
}
Item.prototype.setPrice = function(price){
	this.item.price = price;
}
Item.prototype.setEnable = function(enable){
	this.item.enable = enable;
}
Item.prototype.getType = function(){
	return this.item.type;
}
Item.prototype.getPrice = function(){
	return this.item.price;
}