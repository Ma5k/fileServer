/**
 * ajax封装（promise）
 * @param {*} url 
 * @param {*} data 
 */
function ajaxGet(url, data) {
    url = location.href + url;
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
        let url_send = url + '?';
        for (let key in data) {
            url_send += key;
            url_send += '=' + data[key] + '&';
        }
        xhr.open("GET", url_send, true);
        xhr.send();
    });
}

/**
 * Ajax的post请求封装
 * @param {*} url 
 * @param {*} data 
 */
function ajaxPost(url, data){
    url = location.href + url;
    let xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.open("POST", url);
        //application/x-www-form-urlencoded：窗体数据被编码为名称/值对
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    });
}