window.onload = function () {
    let url = 'getFileInfo';
    let data = { filePath: "./dir" }
    let promise = ajaxGet(url, data);
    promise.then(function (res) {
        let args = {
            data: JSON.parse(res),
            dom: document.getElementsByClassName("list")[0],
            callback: function (node) {
                showFile(node);
            }
        }
        let tree = new Tree(args);
    }).catch(function (status) {
        alert("请求失败：" + status);
    })
    document.getElementById("save").addEventListener("click", save);
    // document.getElementById("download").addEventListener("click", downLoad);
}

/**
 * 展示文件内容
 * @param {*} currentClickNode 
 */

 //tips：面板类    树添加当前点击节点信息   将树当前点击节点信息给其他如面板类和按钮类  *************
 
function showFile(currentClickNode) {
    document.getElementById("info").innerHTML = "文件名：" + currentClickNode.name
        + "  创建时间：" + currentClickNode.cTime;
    if (currentClickNode.isFile) {
        let data = { filePath: currentClickNode.filePath };
        let url = "loadFile";
        let promise = ajaxGet(url, data);
        promise.then(function (res) {
            document.getElementById("text").value = res;
        }).catch(function (status) {
            alert("请求失败：" + status);
        })
    }
}
