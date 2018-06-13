//处理HTTP请求
var querystring = require("querystring");
var fs = require("fs");
var path = require("path");
var url = require("url");

function getText(response) {
    var text = "welcome to my server";
    console.log(text);
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(text);
    response.end();
}

function getImage(response) {
    console.log("getImage");
    fs.readFile("./public/images/huaji.jpg", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, { "Content-type": "text/plain" });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, { "Content-Type": "image/jpg" });
            response.write(file, "binary");
            response.end();
        }
    });
}

function get(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("query:" + query);
    var queryObj = querystring.parse(query);
    for (key in queryObj) {
        console.log("key:" + key + ", value:" + queryObj[key]);
    }
    var type = queryObj["type"];
    switch (type) {
        case "text":
            getText(response);
            break;
        case "image":
            getImage(response);
            break;
        default:
            var text = "type " + type + " is unknown";
            console.log(text);
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.write(text);
            response.end();
            break;
    }
}

function hello(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("welcome to index.html");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(fs.readFileSync(__dirname + '\\public\\html\\index.html'));
}

// 获取文件信息
function getFileInfo(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("query:" + query);
    console.log("response:" + response);
    console.log("getFileInfo");
    // 将文件路径返回
    var queryObj = querystring.parse(query);
    var filePath = queryObj["filePath"];
    function fileInfo(filePath) {
        console.log("filepath:" + filePath);
        var filesTree = {};
        var stats = fs.statSync(filePath);
        filesTree.name = path.basename(filePath);
        filesTree.filePath = filePath;
        filesTree.isFile = stats.isFile();
        filesTree.isDirectory = stats.isDirectory();
        filesTree.cTime = stats.ctime;
        return filesTree;
    }
    var obj = {};
    var obj = fileInfo(filePath);
    var str = JSON.stringify(obj);
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(str);
}

/**
 * 获取当前路径的子目录返回json
 * @param {*} query 
 * @param {*} response 
 */
function getFileChildren(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("query:" + query);
    console.log("response:" + response);
    console.log("getFileChildren");
    // 将文件路径返回
    var queryObj = querystring.parse(query);
    var filePath = queryObj["filePath"];
    function fileInfo(filePath) {
        console.log("filepath:" + filePath);
        var filesTree = {};
        var stats = fs.statSync(filePath);
        filesTree.name = path.basename(filePath);
        filesTree.filePath = filePath;
        filesTree.isFile = stats.isFile();
        filesTree.isDirectory = stats.isDirectory();
        filesTree.cTime = stats.ctime;
        return filesTree;
    }
    function childrenInfo(filePath) {
        console.log("filepath:" + filePath);
        var fileChildren = [];
        fs.readdirSync(filePath).forEach(function (filename) {
            var currentPath = path.join(filePath, filename);
            fileChildren.push(fileInfo(currentPath));
        })
        return fileChildren;
    }
    var obj = {};
    var obj = childrenInfo(filePath);
    var str = JSON.stringify(obj);
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(str);
}

/**
 * 文件传到网页
 * @param {*} query 
 * @param {*} response 
 */
function loadFile(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    console.log("loadFile");
    //传入文件的路径
    var queryObj = querystring.parse(query);
    var filePath = queryObj["filePath"];
    var suffix = path.extname(filePath);
    switch (suffix) {
        case '.txt':
        case '.js':
        case '.html':
        case '.css':
        case '.json':
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    response.writeHead(200, { "Content-type": "application/text;charset=utf-8" });
                    response.end(data);
                }
            });
            break;
        case '.jpg':
            break;
        case '.gif':
            break;
        case '.png':
            fs.readFile(filePath, 'binary', function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    response.writeHead(200, { "Content-type": "image/png" });
                    response.write(data, 'binary');
                    response.end(data);
                }
            });
            break;
        case '.jpeg':
            break;
        default:
            response.writeHead(200, { "Content-type": "application/text" });
            response.end("不能识别的文件类型");
            break;
    }
}

/**
 * 写入本地文件
 * @param {*} query 
 * @param {*} response 
 */
function writeFile(request, response) {
    var data = "";
    request.setEncoding('utf-8');
    request.addListener('data', function (chunk) {
        data += chunk;
    });
    request.addListener('end', function () {
        var params = querystring.parse(data);
        fs.writeFile(params["path"], params["fileData"], { flag: 'w', encoding: 'utf-8', mode: '0666' }, function (err) {
            if (err) {
                console.log("文件写入失败")
            } else {
                console.log("文件写入成功");
            }
        });
    });   
}

/**
 * 下载文件
 * @param {*} request 
 * @param {*} response 
 */
function downLoadFile(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    var path = query.path;
    var fileName = query.fileName;
    request.set({
        'Content-Type':'application/octet-stream',
        'Content-Disposition':'attachment:filename=' + fileName
    });
    fs.createReadStream(path).pipe(request);
}

exports.get = get;
exports.hello = hello;
exports.getFileInfo = getFileInfo;
exports.getFileChildren = getFileChildren;
exports.loadFile = loadFile;
exports.writeFile = writeFile;
exports.downLoadFile = downLoadFile;