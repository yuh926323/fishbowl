function FloatText(font, color, align, baseline, text, x1, y1, x2, y2, times, type){ // 這是個物件，這裡的 color 可傳入 rgba 字串(沒有漸變消失功能)，也可只傳入顏色代碼6碼(有漸變消失功能)
	this.attribute = {
		x1 : x1,
		y1 : y1,
		x2 : x2,
		y2 : y2,
		times : times,
		font : font,
		color : color,
		textAlign : align,
		textBaseline : baseline,
		text : text,
		type : type
	};
	this.x_delta = (this.attribute.x2 - this.attribute.x1) / this.attribute.times;
	this.y_delta = (this.attribute.y2 - this.attribute.y1) / this.attribute.times;
	this.a_delta = -(1 / this.attribute.times);
	this.alpha = 1;
}

FloatText.prototype.draw = function(){
	if(this.attribute.type == FLOAT_TYPE.RFRESH_PLAYER_MONEY){
		var string;
		if(player.money >= 100000000000) player.money = 99999999999;
		if(player.money < 0) player.money = 0;
		if(player.money < 10) string = "$ 00000" + player.money;
		else if(player.money < 100) string = "$ 0000" + player.money;
		else if(player.money < 1000) string = "$ 000" + player.money;
		else if(player.money < 10000) string = "$ 00" + player.money;
		else if(player.money < 100000) string = "$ 0" + player.money;
		else string = "$ " + player.money;
		this.attribute.text = string;
	}
	if(this.attribute.times > 0)this.attribute.times--;
	this.attribute.x1 += this.x_delta;
	this.attribute.y1 += this.y_delta;
	this.alpha += this.a_delta;
	if(this.alpha < 0) this.alpha = 0;
	ctx.font = this.attribute.font;
	var fillStyle;
	if(this.attribute.color.charAt(0) == 'r' &&
		this.attribute.color.charAt(1) == 'g' &&
		this.attribute.color.charAt(2) == 'b' &&
		this.attribute.color.charAt(3) == 'a') fillStyle = this.attribute.color;
	else fillStyle = "rgba("+getCHex(this.attribute.color.charAt(0)+this.attribute.color.charAt(1))+","+getCHex(this.attribute.color.charAt(2)+this.attribute.color.charAt(3))+","+getCHex(this.attribute.color.charAt(4)+this.attribute.color.charAt(5))+","+this.alpha+")";
	ctx.fillStyle = fillStyle;
	ctx.textAlign = this.attribute.textAlign;
	ctx.textBaseline = this.attribute.textBaseline;
	ctx.fillText(this.attribute.text, Math.floor(this.attribute.x1), Math.floor(this.attribute.y1));
}
FloatText.prototype.complete = function(){
	if(this.attribute.times == 0) return true;
	else return false;
}