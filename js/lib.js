/*******************
Author: Dragon
CreatDate: 2013/10/26
UpdateDate: 2013/12/25
File: lib.js
Version: v1.0
Description: this file is used 'Feed Fish' game library.
*******************/

function getMouseX(e){
	var mouseX;
	if(e.offsetX){
		mouseX = e.offsetX;
	}
	else if(e.layerX){
		mouseX = e.layerX;
	}
	else{
		mouseX = 0;
	}
	return mouseX;
}
function getMouseY(e){
	var mouseY;
	if(e.offsetY){
		mouseY = e.offsetY;
	}
	else if(e.layerY){
		mouseY = e.layerY;
	}
	else{
		mouseY = 0;
	}
	return mouseY;
}
function check_mousedown(mouseX, mouseY){
	for(var i=0;i<zone_list.length;i++){
		var object = zone_list.getElem(i);
		if(object.isset(mouseX, mouseY)){
			var index = object.getIndex();
			if(index < REGION.SELL_FISH) shop[i].setFrame(1);
			else if(index == REGION.SELL_FISH) tool[0].change_image(DEF_TOOL_PATH[0][1]);
			else if(index == REGION.ALL_HARVEST){
				tool[1].change_image(DEF_TOOL_PATH[1][1]);
			}
			mouse_target = index;
			break;	// �N����ϰ�F�A�i�H���X�j���ָ귽����
		}
	}
}
function check_mouseup(mouseX, mouseY){
	for(var i=0;i<zone_list.length;i++){
		if(i < REGION.SELL_FISH) shop[i].setFrame(0);
		
		var object = zone_list.getElem(i);
		if(object.isset(mouseX, mouseY)){
			var index = object.getIndex();
			if(mouse_target == index){
				if(index < REGION.SELL_FISH){ // �N��O�ө�����
					var shop_type = shop[index].getType();
					var shop_price = shop[index].getPrice();
					switch(shop_type){
						case 0:{	// �N��O��w�Ϯ�
							break;
						}
						case 1:{	// �N��O�R��
							if(player.money >= shop_price){
								fish_list.addNode(fish_list.length, new Fish(FISH_TYPE.BLUE_TROPICAL_FISH));
								player_money_add(-shop_price);
							}
							else{	// �g�����������p�A�Ψ�B�ʤ�r�C
								player_money_not_enough();
							}
							break;
						}
						case 2:{	// �N��O�ɯŹ}��
							if(player.money < shop_price){	// �g�����������p�A�Ψ�B�ʤ�r�C
								player_money_not_enough();
							}
							else{
								if(player.feed.level < 2){
									player.feed.level++;
									player_money_add(-shop_price);
									shop[index].setPrice(shop[index].getPrice()+150);
									if(player.feed.level == 2) shop[index].setEnable(false);
								}
							}
							break;
						}
						default:{}
					}
				}
				else if(index == REGION.SELL_FISH){	// �N���I�� �泽�u��
					if(player.cursor == null){
						player.cursor = new CreatImage(DEF_CURSOR_PATH, 1, 32, 32, 0, 0, mouseX+16, mouseY);
						tool[0].change_image(DEF_TOOL_PATH[0][1]);
					}
					else{
						player.cursor = null;
						tool[0].change_image(DEF_TOOL_PATH[0][0]);
					}
				}
				else if(index == REGION.AQUARIUM){	// �N���I����ڽc
					if(player.cursor != null){ // �泽���A
						var target_fish = check_click_fish(mouseX, mouseY);	// ���o�I�쳽���s���A�S�I��h�^�� -1
						if(target_fish >= 0){
							var object = fish_list.getElem(target_fish);
							var shop_price;
							if(object.fish.status_type == FISH_STATUS_TYPE.DIE) shop_price = 1;
							else shop_price = shop[0].getPrice();
							fish_list.deletNode(target_fish);
							player_money_add(shop_price);
						}
					}
					else if(check_click_treasure(mouseX, mouseY) >= 0){ // �p�G�O�I���_��
						var target_treasure = check_click_treasure(mouseX, mouseY);
						var temp_var = treasure_list.getElem(target_treasure);
						temp_var.main.moveTo.x = 25;
						temp_var.main.moveTo.y = 120;
						temp_var.main.moveTo.times = Math.floor(Math.random()*30+30);
						temp_var.main.moveTo.enable = true;
						var clickSound = new Audio('media/click_treasure.mp3');
						clickSound.volume = 0.5;
						clickSound.play();
					}
					else{	// �򥻤W�P�_������
						if(player.money >= 5 && (mouseX > 48 && mouseX < canvas.width-48) && (mouseY > 168 && mouseY < canvas.height-48)){ // ���F�n�P�_�����O�_�����H�~�A�٭n�P�_�O�_�b��ɤ�
							player_money_add(-5);
							player.feed.feed.addNode(player.feed.feed.length, new function(){
								this.main = new CreatImage(DEF_FEED_PACKAGE_PATH[player.feed.level], 1, 16, 16, 0, 0, mouseX, mouseY, player.feed.feed_index);
								this.eaten = false;
								this.time = 210;
								this.index = player.feed.feed_index;
							});
							player.feed.feed_index++;
						}
					}
				}
				else if(index == REGION.ALL_HARVEST){	// �N���I��@�䦬ì
					tool[1].change_image(DEF_TOOL_PATH[1][0]);
					if(treasure_list.length > 0){
						for(var j=0;j<treasure_list.length;j++){
							var object = treasure_list.getElem(j);
							if(!object.main.moveTo.enable){
								object.main.moveTo.x = 25;
								object.main.moveTo.y = 120;
								object.main.moveTo.times = Math.floor(Math.random()*30+30);
								object.main.moveTo.enable = true;
							}
						}
						var clickSound = new Audio('media/click_treasure.mp3');
						clickSound.volume = 0.5;
						clickSound.play();
					}
				}
			}
			//break; �o�䤣�����X�A�]���n�N�Ҧ� disable �ܦ� enable
		}
	}
}
function check_mousemove(mouseX, mouseY){
	if(player.cursor != null){
		player.cursor.move(mouseX+16, mouseY);
	}
}
function setText(font, color, align, baseline, text, x, y){
	ctx.font = font;
	ctx.fillStyle = color;
	ctx.textAlign = align;
	ctx.textBaseline = baseline;
	ctx.fillText(text, x, y);
}
function getCHex(string){
	string = string.toUpperCase();	//��j�g
	var DEF_COLOR_NUM = ['A','B','C','D','E','F'];
	var num1=-1,num2=-1,temp;
	var shift = 0;
	if(string.charAt(shift) == '#') shift++;
	for(var i=0;i<16;i++){
		if(i > 9){
			temp = DEF_COLOR_NUM[i-10];
		}
		else{
			temp = i;
		}
		if(num1!=-1 && num2!=-1) break;
		if(string.charAt(shift) == ''+temp+'') num1 = i;
		if(string.charAt(shift+1) == ''+temp+'') num2 = i;
	}	
	return num1*16+num2;
}
function clear(ctx) {	
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
}
function check_click_fish(mouseX, mouseY){
	var target = -1;
	for(var i=fish_list.length-1;i>=0;i--){	// �}�l�M���I��������A�ھڹϼh�q�̤W�h�A�]�N�O�̫�e�X�����}�l��
		var object = fish_list.getElem(i);
		if(object.fish.image.region.isset(mouseX, mouseY)){
			target = i;
		}
	}
	return target;
}
function check_click_treasure(mouseX, mouseY){
	var target = -1;
	for(var i=0;i<treasure_list.length;i++){	// �}�l�M���I�줰���_��
		var object = treasure_list.getElem(i);
		if(object.main.region != null){
			if(object.main.region.isset(mouseX, mouseY)){
				target = i;
			}
		}
	}
	return target;
}
function player_money_not_enough(){
	var string;
	if(player.money >= 100000000000) player.money = 99999999999;
	if(player.money < 0) player.money = 0;
	if(player.money < 10) string = "$ 00000" + player.money;
	else if(player.money < 100) string = "$ 0000" + player.money;
	else if(player.money < 1000) string = "$ 000" + player.money;
	else if(player.money < 10000) string = "$ 00" + player.money;
	else if(player.money < 100000) string = "$ 0" + player.money;
	else string = "$ " + player.money;
	floattext_list.addNode(floattext_list.length, new FloatText("25px 'Play'", "rgba("+getCHex('ff')+","+getCHex('00')+","+getCHex('00')+",1.0)", "right", "bottom", string , 240, 134, 240, 134, 60, 1));
	floattext_list.addNode(floattext_list.length, new FloatText("25px 'Play'", "rgba("+getCHex('f5')+","+getCHex('eb')+","+getCHex('3c')+",1.0)", "right", "bottom", string , 240, 134, 240, 134, 40, 1));
	floattext_list.addNode(floattext_list.length, new FloatText("25px 'Play'", "rgba("+getCHex('ff')+","+getCHex('00')+","+getCHex('00')+",1.0)", "right", "bottom", string , 240, 134, 240, 134, 20, 1));
}
function player_money_add(money){
	player.money += money;
	floattext_list.addNode(floattext_list.length, new FloatText("25px 'Play'", "000000", "center", "bottom", ((money<0)?"":"+")+money, 232, 136, 232, 76, 60));
	floattext_list.addNode(floattext_list.length, new FloatText("25px 'Play'", "f5eb3c", "center", "bottom", ((money<0)?"":"+")+money, 230, 134, 230, 74, 60));
}