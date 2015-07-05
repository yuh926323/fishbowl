var DEF_FISH_TYPE = {
	speed_x : [3.0],
	speed_y : [1.5]
}
var DEF_HUNGRY = 4000;
var DEF_MAKE_MONEY_COUNT = 250;

function Fish(type){
	this.fish = {				// 魚的基本資訊
		image : {},				// 圖片影像
		name : "",				// 名子，暫時用不到?
		type : type,			// 魚的種類，根據 type 去產生對應的圖片
		hungry : 2000,			// 初始飢餓度
		status_type : FISH_STATUS_TYPE.HUNGRY,		// 魚的狀態
		status : {},
		food_count : 0,			// 記錄從出生後吃了多少食物
		age : 0,				// 年齡，這隻魚活了幾次計時器觸發
		money_type : type,		// 生產金錢的種類
		make_money_count : 0	// 下一次生產計數，超過定值後將以機率觸發生產，數值越大生產機率越大，生產後歸 0
	};
	this.move = {
		x : Math.floor(Math.random()*700),
		y : Math.floor(Math.random()*350)+150,
		dir_x : (Math.random()<0.5)?1:-1,
		dir_y : (Math.random()<0.5)?1:-1,
		speed_x : DEF_FISH_TYPE.speed_x[type] + (Math.random()*2 - 1),
		speed_y : DEF_FISH_TYPE.speed_y[type] + (Math.random()*1 - 0.5),
	};
	this.target ={
		index : -1,
		target : null,
		x : 0,
		y : 0
	}
	this.fish.image = new CreatImage(DEF_FISH_PATH[this.fish.type], 1, 96, 96, 0, 0, this.move.x, this.move.y);
	this.fish.status = new CreatImage(DEF_FISH_STATUS_PATH[this.fish.status_type], 1, 100, 100, 0, 0, -1000, -1000);
	this.action = Math.floor(Math.random()*12);
	this.action_times = 0;
}
Fish.prototype.AI = function(){
	var status_type = FISH_STATUS_TYPE.DEFAULT;
	if((this.fish.hungry/DEF_HUNGRY) <= 0.2){
		status_type = FISH_STATUS_TYPE.HUNGRY;
		if(this.fish.hungry <= 0) status_type = FISH_STATUS_TYPE.DIE;
	}
	if(status_type == FISH_STATUS_TYPE.DIE){
		this.fish.image.setAniFrameY(1);
		if(this.move.y > 160) this.move.y--;
	}
	else{
		this.fish.image.setAniFrameY(0);
		if((this.fish.hungry/DEF_HUNGRY) > 0.5 || player.feed.feed.length == 0){	// 代表不餓的情況或是沒有飼料的情況，恣意移動
			//================檢查邊界，碰到之後更改 x,y 移動方向================
			if(this.move.x < this.move.speed_x) this.move.dir_x = 1;
			if(this.move.y < this.move.speed_y + 150) this.move.dir_y = 1;
			if(this.move.x > ctx.canvas.width - this.fish.image.getImageWidth()) this.move.dir_x = -1;
			if(this.move.y > ctx.canvas.height - this.fish.image.getImageHeight()) this.move.dir_y = -1;
			//================檢查邊界，碰到之後更改 x,y 移動方向================
			if(this.action_times <= 0){	// 當該次動作結束時，才可更換移動類型
				while(true){
					var temp_action = Math.floor(Math.random()*12);
					if(temp_action >= 0 && temp_action <=2){
						if(this.action >= 3 && this.action <= 4){
							// 代表前一次是慢的，若這次選擇到快的會很奇怪，因此需要重新選擇
						}
						else{
							this.action_times = Math.floor(Math.random()*50+45);
							break;
						}
					}
					else if(temp_action >= 3 && temp_action <=4){
						if(this.action >= 0 && this.action <= 2){
							// 代表前一次是快的，若這次選擇到慢的會很奇怪，因此需要重新選擇
						}
						else{
							this.action_times = Math.floor(Math.random()*35+40);
							break;
						}
					}
					else if(temp_action >= 5 && temp_action <= 7){
						this.action_times = Math.floor(Math.random()*50+50);
						break;
					}
					else if(temp_action >= 8 && temp_action <= 10){
						if(this.action >= 8 && this.action <= 10){
							//代表目前選擇跟前一次都是轉方向，要重新亂數選取動作
						}
						else{
							this.action_times = 1;
							break;
						}
					}
					else{
						this.action_times = Math.floor(Math.random()*30);
						break;
					}
				}
				this.action = temp_action;
			}
			switch(this.action){
				case 0:{	// 第0種，移動 x 軸一小段距離(快)
					this.move.x += this.move.dir_x * this.move.speed_x;
					this.move.y += this.move.dir_y * (this.move.speed_y/4);
					break;
				}
				case 1:{	// 第1種，移動 y 軸一小段距離(快)
					this.move.x += this.move.dir_x * (this.move.speed_x/4);
					this.move.y += this.move.dir_y * this.move.speed_y;
					break;
				}
				case 2:{	// 第2種，移動 x,y 軸一小段距離(快)
					this.move.x += this.move.dir_x * this.move.speed_x;
					this.move.y += this.move.dir_y * this.move.speed_y;
					break;
				}
				case 3:{	// 第3種，稍微移動 x 軸一小段距離(慢)
					this.move.x += this.move.dir_x * (this.move.speed_x/2);
					this.move.y += this.move.dir_y * (this.move.speed_y/8);
					break;
				}
				case 4:{	// 第4種，稍微移動 y 軸一小段距離(慢)
					this.move.x += this.move.dir_x * (this.move.speed_x/8);
					this.move.y += this.move.dir_y * (this.move.speed_y/2);
					break;
				}
				case 5:{	// 第5種，移動 x 軸一小段距離，並會稍微往 y 軸偏移(稍微慢)
					this.move.x += this.move.dir_x * this.move.speed_x;
					this.move.y += this.move.dir_y * (this.move.speed_y/2);
					break;
				}
				case 6:{	// 第6種，移動 y 軸一小段距離，並會稍微往 x 軸偏移(稍微慢)
					this.move.x += this.move.dir_x * (this.move.speed_x/2);
					this.move.y += this.move.dir_y * this.move.speed_y;
					break;
				}
				case 7:{	// 第7種，移動 x,y 軸一小段距離(稍微慢)
					this.move.x += this.move.dir_x * (this.move.speed_x/2);
					this.move.y += this.move.dir_y * (this.move.speed_y/2);
					break;
				}
				case 8:{	// 第8種，改變 x 軸方向
					if(this.move.dir_x == 1) this.move.dir_x = -1;
					else this.move.dir_x = 1;
					break;
				}
				case 9:{	// 第9種，改變 y 軸方向
					if(this.move.dir_y == 1) this.move.dir_y = -1;
					else this.move.dir_y = 1;
					break;
				}
				case 10:{	// 第10種，同時改變 x,y 軸方向
					if(this.move.dir_x == 1) this.move.dir_x = -1;
					else this.move.dir_x = 1;
					if(this.move.dir_y == 1) this.move.dir_y = -1;
					else this.move.dir_y = 1;
					break;
				}
				case 11:{	// 第11種，幾乎不移動
					this.move.x += this.move.dir_x * (Math.random()/2);
					this.move.y += this.move.dir_y * (Math.random()/2);
					break;
				}
				default:{	// 預設
					this.move.x += this.move.dir_x * this.move.speed_x;
					this.move.y += this.move.dir_y * this.move.speed_y;
				}
			}
			this.action_times -= 1;
		}
		else{	// 代表飢餓，要找尋飼料吃，而且有飼料才會進來尋找
		this.action_times = 0; // 將動作重新歸 0，換下一個動作
		for(var i=0;;i++){	// 開始找飼料
			if(player.feed.feed.search(i)){
				var temp_var = player.feed.feed.getElem(i);
				if(this.target.target == null){
					this.target.target = temp_var;
					this.target.index = temp_var.index;
					this.target.x = temp_var.main.getX();
					this.target.y = temp_var.main.getY();
				}
				else{
					this.target.x = this.target.target.main.getX();
					this.target.y = this.target.target.main.getY();
					var temp_x = temp_var.main.getX();
					var temp_y = temp_var.main.getY();
					var x1_delta = this.move.x - temp_x;
					var y1_delta = this.move.y - temp_y;
					var x2_delta = this.move.x - this.target.x;
					var y2_delta = this.move.y - this.target.y;
					if( (Math.pow(Math.abs(x1_delta), 2)+Math.pow(Math.abs(y1_delta), 2)) <
						(Math.pow(Math.abs(x2_delta), 2)+Math.pow(Math.abs(y2_delta), 2)) ){
						this.target.target = temp_var;
						this.target.index = temp_var.index;
						this.target.x = this.target.target.main.getX();
						this.target.y = this.target.target.main.getY();
					}
				}
			}
			else break;
		}
		this.target.x = this.target.target.main.getX();
		var x2_delta = this.target.x - this.move.x - 48;
		if(Math.abs(x2_delta) > this.move.speed_x){
			if(x2_delta > 0) this.move.dir_x = 1;
			else this.move.dir_x = -1;
			this.move.x += this.move.dir_x * this.move.speed_x;
		}
		else{
			this.move.x = this.target.x - 48;
		}
		this.target.y = this.target.target.main.getY();
		var y2_delta = this.target.y - this.move.y - 48;
		if(Math.abs(y2_delta) > this.move.speed_y*2.5){
			if(y2_delta > 0) this.move.dir_y = 1;
			else this.move.dir_y = -1;
			this.move.y += this.move.dir_y * this.move.speed_y*2.5;
		}
		else{
			this.move.y = this.target.y - 48;
		}
		if(this.target.target.main.region.isset(this.move.x+8+48, this.move.y+8+48)){// 代表吃到魚飼料
			this.target.target.eaten = true;
			switch(player.feed.level){
				case 1:{
					this.fish.hungry += Math.random()*200+400;
					this.fish.food_count+=2;
					break;
				}
				case 2:{
					this.fish.hungry += Math.random()*150+550;
					this.fish.food_count+=3;
					break;
				}
				default:{
					this.fish.hungry += Math.random()*250+250;
					this.fish.food_count++;
					break;
				}
			}
			var clickSound = new Audio('media/fish_chew_0'+Math.floor(Math.random()*3+1)+'.mp3');
			clickSound.volume = 0.5;
			clickSound.play();
		}
	}
		if(this.fish.make_money_count > DEF_MAKE_MONEY_COUNT){ // 設置魚將會產寶物
			if(Math.random() < 0.01+(this.fish.make_money_count-DEF_MAKE_MONEY_COUNT)/10000 ){
				var money_type = this.fish.money_type;
				var move = this.move;
				treasure_list.addNode(treasure_list.length, new function(){
					this.main = new CreatImage(DEF_TREASURE_PATH[money_type], 1, 32, 32, 0, 0, Math.floor(move.x)+48, Math.floor(move.y)+48);
					this.time = 420;
					this.price = Math.floor(Math.random()*20+30);
				});
				this.fish.make_money_count = 0;
			}
		}
		this.fish.make_money_count++;
	}
	this.fish.image.setAniFrameX((this.move.dir_x==1?1:0));
	//============================魚的狀態開始============================
	if( this.fish.status_type != status_type){
		this.fish.status.change_image(DEF_FISH_STATUS_PATH[status_type]);
		this.fish.status_type = status_type;
	}
	var status_x = this.move.x;
	var status_y = this.move.y - 50;
	if(this.move.x < 50) {status_x +=50; this.fish.status.setAniFrameX(1);}
	else if(this.move.x > 600) {status_x -=50; this.fish.status.setAniFrameX(0);}
	else{
		if(this.move.dir_x == 1) status_x +=50;
		else status_x -=50;
		this.fish.status.setAniFrameX((this.move.dir_x==1?1:0));
	}
	this.fish.status.move(status_x, status_y);
	this.fish.status.draw(ctx);
	//============================魚的狀態結束============================
	this.fish.image.move(Math.floor(this.move.x), Math.floor(this.move.y));
	this.fish.image.draw(ctx);
}
Fish.prototype.setHungry = function(hungry){
	this.fish.hungry = hungry;
}
Fish.prototype.getHungry = function(){
	return this.fish.hungry;
}
Fish.prototype.getX = function(){
	return this.move.x;
}
Fish.prototype.getY = function(){
	return this.move.y
}
Fish.prototype.getDirX = function(){
	return this.move.dir_x;
}