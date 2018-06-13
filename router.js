//将HTTP请求转发给处理函数requestHandlers

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require("url");

function route(request, response, handle) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("route for" + pathname);
    var suffix = path.extname(pathname);
    var basename = path.basename(pathname);
    var realpath = __dirname + '\\' + 'public' + '\\';
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else {
        switch (suffix) {
            case '.html':
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(fs.readFileSync(realpath + '\\' + 'html' + '\\' + basename));
                break;
            case '.css':
                response.writeHead(200, { "Content-Type": "text/css" });
                response.end(fs.readFileSync(realpath + '\\' + 'css' + '\\' + basename));
                break;
            case '.js':
                response.writeHead(200, { "Content-Type": "text/javascript" });
                response.end(fs.readFileSync(realpath + '\\' + 'js' + '\\' + basename));
                break;
            case '.png':
                response.writeHead(200, { "Content-Type": "image/png" });
                response.end(fs.readFileSync(realpath + '\\' + 'images' + '\\' + basename));
                break;
            case '.jpg':
                response.writeHead(200, { "Content-Type": "image/jpg" });
                response.end(fs.readFileSync(realpath + '\\' + 'images' + '\\' + basename));
                break;
            default:
                console.log("No request handler found for " + pathname);
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("404 not found");
                response.end();
                break;
        }
    }
}

exports.route = route;