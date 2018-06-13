/**
 * 面板类
 */
class Panel{
    
    constructor(args){
        this.node = args.currentNode;
        this.infoDom = args.infoDom;
        this.detailDom = args.detailDom;
    }

    showInfo(){
        this.infoDom.innerHTML = "文件名：" + this.node.name
        + "创建时间：" + this.node.cTime;
    }

    showDetail(){
        let data = { filePath: this.node.filePath };
        let url = "loadFile";
        let promise = ajaxGet(url, data);
        promise.then(function (res) {
            this.detailDom.value = res;
        }).catch(function (status) {
            alert("请求失败：" + status);
        })
    }
}