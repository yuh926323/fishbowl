function LinkListNode() {
    this.data = null;
    this.next = null;
}
function List() {
    this.head = new LinkListNode();
    this.length = 0;
}
/*search*/
List.prototype.search = function ( i ) { //搜索第 i 個元素 返回節點

    if (i < 0) { //
        return false;        
    }
    
    var j = 0; //從 0 開始 我有一個 Head 節點
    var p = this.head;
    
    while (p != null && j < i) {
        p = p.next;
        j++;
    }
    
    if (j > i) { // 0 ~ i 都已經查詢過了，還是找不到節點回傳 false
        return false;
    }
	if (this.head.data == null){	// 代表當頭是空的應該要回傳 false
		return false;
	}
    
    return p;
};

List.prototype.addNode = function ( i, e ) {//在第i個位置前插入元素e
    var p;
    var node;

    if(i==0){ // 插入第 0 個的情況
		node = this.head;
		node.data = e;
		node.next = null;
	}
	else{
		p = this.search(i-1);
		node = new LinkListNode();
		node.data = e;
		node.next = p.next;
		p.next = node;
	}
    this.length++;//長度+1
};

List.prototype.deletNode = function ( i ) {	//刪除第i個元素
    var p, q;
	if(i==0){
		p = this.head;
		if(p.next != null){
			q = p.next;
			p = null;
			this.head = q;
		}
		else{
			p.data = null;
			p.next = null;
		}
	}
	else{
		p = this.search(i-1);
		q = p.next;
		p.next = q.next;
	}
    if(this.length > 0) this.length--;	//總長度-1
};

List.prototype.getElem = function ( i ) {//獲取第i的元素

    var node = this.search(i);
    
    return node.data;//返回節點的數據
};

List.prototype.clear = function () {//清空鏈表
    var p = this.head;
    var q = null;
    
    while (p.next != null) {
        q = p.next;
        p = null;
        this.length--;
        p = q;
    }
};

List.prototype.getLength = function () {//獲取鏈表長度
    
    var p = this.head;
    var j = 0;
    
    while(p.next != null){
        j++;
        p = p.next;
    }
    
    return j;
};

List.prototype.print = function () {//印出
    var p = this.head;
    
    while (p != null && p.data != null) {
		console.log(p.data+",");
        p = p.next;
        //document.write(p.data+",");
    }
    
    //document.writeln();
};
/*test*/
/*var linkList = new List();
linkList.addNode(1, 1);
linkList.addNode(2, 2);
linkList.addNode(1, 3);
linkList.addNode(2, 4);
linkList.print();

document.writeln();
document.writeln("length::"+linkList.getLength());
linkList.deletNode(1);
linkList.print();
document.writeln();
document.write("length::"+linkList.length);
linkList.clear();
document.write("length::"+linkList.length);*/