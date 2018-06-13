//服务器的主文件

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.hello;
handle["/get"] = requestHandlers.get;
handle["/getFileInfo"] = requestHandlers.getFileInfo;
handle["/loadFile"] = requestHandlers.loadFile;
handle["/getFileChildren"] = requestHandlers.getFileChildren;
handle["/writeFile"] = requestHandlers.writeFile;
handle["/downLoadFile"] = requestHandlers.downLoadFile;
//调用server.js中的start函数
server.start(router.route, handle);