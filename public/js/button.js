function save() {
    data = 'path=' + this.filePath + '&fileData=' + document.getElementById("text").value;
    let promise = ajaxPost("writeFile", data);
    promise.then(function (res) {
        alert("保存成功");
    }).catch(function (status) {
        alert("请求失败：" + status);
    })
}

function downLoad() {
    data = {
        path: 'D:\\myserver\\dir\\test.txt',
        fileName: "test.txt"
    };
    let promise = ajaxGet("downLoadFile", data);
    promise.then(function () {
        alert("下载完成");
    }).catch(function (status) {
        alert("请求失败：" + status);
    })
}