//创建HTTP服务器

//请求Node.js自带的HTTP模块并赋值给http变量
var http = require("http");
var url = require("url");

function start(route, handle){

    function onRequest(request, response){
        var urlObj = url.parse(request.url);
        var pathname = urlObj.pathname;
        var query = urlObj.query;
        console.log("Request for " + pathname + " received " + "query:" + query);
        route(request, response, handle);
    }
    //http的createServer函数会返回一个对象，
    //这个对象的listen方法有一个数值参数指定这个HTTP服务器监听的端口号
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;