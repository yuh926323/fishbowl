var canvas;
var ctx;

var time = 0;
var color = ["red","orange","yellow","green","blue","purple","white","black"];

var fish_list = new List();
var treasure_list = new List();
var treasure_time_list = new List();
var INIT_FISH_COUNT = 10;
var floattext_list = new List();
var shop = [];
var tool = [];
var zone_list = new List();
var player = {
	cursor : null,
	feed : {
		feed : new List(),		// �}�ƪ��D��
		feed_index : 0, // count_index
		level : 0				// ���̹}�ƪ�����
	},
	money	:	150
}
var background;
var money_bg;
var mouse_target;

$(function()
{
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	window.document.body.onselectstart = false;
	//---------------------�b game ���U�ƹ��ƥ�---------------------
	var mouseX, mouseY;
	$("#game").mousedown(function(e) {		//�ƹ����U
		mouseX = getMouseX(e);
		mouseY = getMouseY(e);
		check_mousedown(mouseX, mouseY);
		//console.log(mouseX+","+mouseY);
	});
	$("#game").mouseup(function(e) {		//�ƹ���}
		mouseX = getMouseX(e);
		mouseY = getMouseY(e);
		check_mouseup(mouseX, mouseY);
	});
	$("#game").mousemove(function(e) {		//�ƹ�����
		mouseX = getMouseX(e);
		mouseY = getMouseY(e);
		check_mousemove(mouseX, mouseY);
    });
	//---------------------���U�ƹ��ƥ󵲧�---------------------
	//---------------------���U�ϰ�ƥ�}�l---------------------
	for(var i=0;i<REGION.SELL_FISH;i++){ // ���U
		switch(i){
			case 0: // ��
				shop[i] = new Item(SHOP_ITEM_TYPE.NEW_FISH, i, true, 200);
				break;
			case 1: // �}��
				shop[i] = new Item(SHOP_ITEM_TYPE.UPGRADE_FEED, i, true, 500);
				break;
			default: // �T��ϥ�
				shop[i] = new Item(SHOP_ITEM_TYPE.DEFAULT, i, false, 0);
		}
		zone_list.addNode(zone_list.length, shop[i].item.image.region);
	}
	zone_list.addNode(zone_list.length, new Region(REGION.SELL_FISH, 730, 105, 40, 30, 1)); // �泽
	zone_list.addNode(zone_list.length, new Region(REGION.AQUARIUM, 0, 140, 800, 440, 1)); // ����
	zone_list.addNode(zone_list.length, new Region(REGION.ALL_HARVEST, 680, 100, 40, 40, 1)); // �@�䦬��
	//---------------------���U�ϰ�ƥ󵲧�---------------------
	//---------------------���U �� �ƥ�}�l---------------------
	for(var i=0;i<INIT_FISH_COUNT;i++){	// ���U��
		fish_list.addNode(fish_list.length, new Fish(FISH_TYPE.BLUE_TROPICAL_FISH));
	}
	//---------------------���U �� �ƥ󵲧�---------------------
	money_bg = new CreatImage(DEF_INTERFACE_PATH[0], 1, 800, 40, 0, 0, 0, 100); // �w�qMoneybar�I��
	tool[0] = new CreatImage(DEF_TOOL_PATH[0][0], 1, 40, 30, 0, 0, 730, 105);	// �Ĥ@�Ӥu��(Tool)
	tool[1] = new CreatImage(DEF_TOOL_PATH[1][0], 1, 40, 40, 0, 0, 680, 100);	// �Ĥ@�Ӥu��(Tool)
	background = new Image();	// �w�q���ڽc�I��
	background.src = DEF_AQUARIUM_BG_PATH[0];
	background.onload = function(){
		ctx.drawImage(background, 0 ,0);
		start_timer = setInterval(gameloop, 30);
	}
	background.onerror = function(){
		document.write("Error loading the image.");
	}
});
function gameloop()
{
	clear(ctx);
	ctx.drawImage(background, 0 ,0);
	money_bg.draw(ctx);
	
	for(var i=0;i<8;i++){
		shop[i].update();
	}
	for(var i=0;i<tool.length;i++){
		tool[i].draw(ctx);
	}
	check_player();
	update_fish();
	update_feed();
	update_treasure();
	update_floattext();
	if(player.cursor != null) player.cursor.draw(ctx);
	setText("40px 'Reenie Beanie'", "rgba("+getCHex('00')+","+getCHex('00')+","+getCHex('00')+",0.25", "center", "bottom", "Just Test seconds count: " + time.toFixed(2) + "ms", canvas.width/2+2, canvas.height+2);
	setText("40px 'Reenie Beanie'", "#ddd", "center", "bottom", "Just Test seconds count: " + time.toFixed(2) + "ms", canvas.width/2, canvas.height);
	time += 0.03;
}

function check_player(){
	var string;
	if(player.money >= 100000000000) player.money = 99999999999;
	if(player.money < 0) player.money = 0;
	if(player.money < 10) string = "$ 00000" + player.money;
	else if(player.money < 100) string = "$ 0000" + player.money;
	else if(player.money < 1000) string = "$ 000" + player.money;
	else if(player.money < 10000) string = "$ 00" + player.money;
	else if(player.money < 100000) string = "$ 0" + player.money;
	else string = "$ " + player.money;
	setText("25px 'Play'", "rgba("+getCHex('00')+","+getCHex('00')+","+getCHex('00')+",0.25)", "right", "bottom", string , 242, 136);
	setText("25px 'Play'", "rgba("+getCHex('f5')+","+getCHex('eb')+","+getCHex('3c')+",1.0)", "right", "bottom", string , 240, 134);
}
function update_fish(){ // �e���q�s���@�����A�e�^�Ĥ@����
	for(var i=fish_list.length-1;i>=0;i--){
		if(fish_list.search(i)){
			var object = fish_list.getElem(i);
			object.AI();
			object.setHungry(object.getHungry()-5);
			if(player.feed.feed.length == 0){
				object.target.target = null;
				object.target.index = -1;
				object.target.x = 0;
				object.target.y = 0;
			}
		}
		else break;
	}
}
function update_feed(){
	for(var i=0;;i++){	// �@�ӭt�d�e�A�_�h�|�]���R���`�I���͹}�ư{�{�����D
		if(player.feed.feed.search(i)){
			var object = player.feed.feed.getElem(i);
			if(object.time > 0) object.time--;
			if(object.main.getY() < canvas.height-30){
				object.main.move(object.main.getX(), object.main.getY()+1);
			}
			object.main.draw(ctx);
		}
		else break;
	}
	for(var i=0;;i++){	// �@�ӭt�d�R�A�_�h�|�]���R���`�I���͹}�ư{�{�����D
		if(player.feed.feed.search(i)){
			var object = player.feed.feed.getElem(i);
			if((object.main.getY() >= canvas.height-30 && object.time <= 0) || object.eaten){
				player.feed.feed.deletNode(i);
				for(var j=0;;j++){	// �R���}�ƪ��ɭԡA�����`�N��N�����ؼФ]�@�֧R��
					if(fish_list.search(j)){
						var object2 = fish_list.getElem(j);
						if(object2.target.index == object.index){
							object2.target.target = null;
							object2.target.index = -1;
							object2.target.x = 0;
							object2.target.y = 0;
						}
					}
					else break;
				}
			}
		}
		else break;
	}
}
function update_treasure(){
	for(var i=0;;i++){	// �_��(�e�X)
		if(treasure_list.search(i)){
			var object = treasure_list.getElem(i);
			if(object.time > 0) object.time--;
			if(object.main.getY() < canvas.height-50){
				object.main.move(object.main.getX(),object.main.getY()+1);
			}
			object.main.draw(ctx);
		}
		else break;
	}
	for(var i=0;;i++){	// �_���۵M�R��
		if(treasure_list.search(i)){
			var object = treasure_list.getElem(i);
			if((object.main.getY() >= canvas.height-50 && object.time <= 0) || (object.main.getX() == 25 && object.main.getY() == 120)){
				if((object.main.getX() == 25 && object.main.getY() == 120)){
					player.money += object.price;
					floattext_list.addNode(floattext_list.length,
					new FloatText("25px 'Play'", "000000", "center", "bottom", "+"+object.price, 232, 136, 232, 76, 60));
					floattext_list.addNode(floattext_list.length,
					new FloatText("25px 'Play'", "f5eb3c", "center", "bottom", "+"+object.price, 230, 134, 230, 74, 60));
				}
				treasure_list.deletNode(i);
			}
		}
		else break;
	}
}
function update_floattext(){
	for(var i=0;;i++){	// �B�ʤ�r
		if(floattext_list.search(i)){
			var object = floattext_list.getElem(i);
			if(object.complete()) floattext_list.deletNode(i);
			else object.draw();
		}
		else break;
	}
}