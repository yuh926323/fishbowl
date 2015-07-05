function LinkListNode() {
    this.data = null;
    this.next = null;
}
function List() {
    this.head = new LinkListNode();
    this.length = 0;
}
/*search*/
List.prototype.search = function ( i ) { //�j���� i �Ӥ��� ��^�`�I

    if (i < 0) { //
        return false;        
    }
    
    var j = 0; //�q 0 �}�l �ڦ��@�� Head �`�I
    var p = this.head;
    
    while (p != null && j < i) {
        p = p.next;
        j++;
    }
    
    if (j > i) { // 0 ~ i ���w�g�d�߹L�F�A�٬O�䤣��`�I�^�� false
        return false;
    }
	if (this.head.data == null){	// �N����Y�O�Ū����ӭn�^�� false
		return false;
	}
    
    return p;
};

List.prototype.addNode = function ( i, e ) {//�b��i�Ӧ�m�e���J����e
    var p;
    var node;

    if(i==0){ // ���J�� 0 �Ӫ����p
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
    this.length++;//����+1
};

List.prototype.deletNode = function ( i ) {	//�R����i�Ӥ���
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
    if(this.length > 0) this.length--;	//�`����-1
};

List.prototype.getElem = function ( i ) {//�����i������

    var node = this.search(i);
    
    return node.data;//��^�`�I���ƾ�
};

List.prototype.clear = function () {//�M�����
    var p = this.head;
    var q = null;
    
    while (p.next != null) {
        q = p.next;
        p = null;
        this.length--;
        p = q;
    }
};

List.prototype.getLength = function () {//���������
    
    var p = this.head;
    var j = 0;
    
    while(p.next != null){
        j++;
        p = p.next;
    }
    
    return j;
};

List.prototype.print = function () {//�L�X
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