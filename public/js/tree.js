/**
 * Tree类
 */
class Tree {
    /**
     * Tree类的构造函数
     * @param {*} data 
     * @param {*} dom 
     */
    constructor(args) {
        this.root = new Node(args.dom, args.data);
        this.callback = args.callback;
        args.dom.addEventListener("click", this.clickNode.bind(this));
        //todo: call和bind    ********
    }
    /**
     * 节点的点击事件
     * @param {*} e 
     */
    clickNode(e){
        e.target.node.isClicked = true;
        let targetLi = e.target;
        let ul = targetLi.nextElementSibling;
        let node = targetLi.node;
        if(node.isDirectory){
            if(node.childrenInited){
                node.displayOrHidden();
            }else{
                node.initChildren();
            }
        }
        this.callback(node);
    }
}

/**
 * 定义Node类
 */
class Node {
    /**
     * Node类的构造函数
     * @param {*} pdom 
     * @param {*} data 
     */
    constructor(pdom, data) {
        this.text = document.createTextNode(data.name);
        this.img = document.createElement("img");
        this.li = document.createElement("li");
        this.ul = document.createElement("ul");

        this.li.node = this;

        this.li.appendChild(this.img);
        this.li.appendChild(this.text);
        this.name = data.name;
        this.cTime = data.cTime;
        this.isDirectory = data.isDirectory;
        this.isFile = data.isFile;

        //标记节点是否是当前点击节点
        this.isClicked = false;
        //标记子children是否已创建
        this.childrenInited = false;
        //标记是否为打开状态
        this.filePath = data.filePath;
        this.open = false;
        this.children = [];        
        if (this.isDirectory) {
            this.img.src = "../images/directory_close.png";
        } else if (this.isFile) {
            this.img.src = "../images/file.png";
        }
        pdom.appendChild(this.li);
        pdom.appendChild(this.ul);
    }

    /**
     * 构造孩子
     */
    initChildren() {
        let url = 'getFileChildren';
        let data = { filePath: this.filePath };

        let promise = ajaxGet(url, data);
        let self = this;
        promise.then(function(res){
            let children = JSON.parse(res);
            for (let i = 0; i < children.length; i++) {
                self.children[i] = new Node(self.ul,children[i]);
            }
        }).catch(function(status){
            alert("请求失败："+status);
        })

        this.img.src = "../images/directory_open.png";
        this.childrenInited = true;
        this.open = true;
    }

    /**
     * 显示和隐藏孩子
     */
    displayOrHidden() {
        if (this.open) {
            this.ul.style.display = "none";
            this.img.src = "../images/directory_close.png";
            this.open = false;
        } else {
            this.ul.style.display = "";
            this.img.src = "../images/directory_open.png";
            this.open = true;
        }
    }
}