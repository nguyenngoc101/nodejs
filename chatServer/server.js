var http    = require('http');
var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var url     = require('url');

var root = __dirname;
var INDEX_PATH = "public/index.html";
var TEMPLATE_PATH = "public/template.html"
var STYLE_PATH = "public/stylesheets/style.css"
var cssFile = getTemplate(path.join(root,STYLE_PATH));
var htmlTemplate = getTemplate(path.join(root,TEMPLATE_PATH)).replace('%style', cssFile);

var server = http.createServer(function(req, res) {
  var ur = url.parse(req.url);
  var absPath = path.join(root, ur.pathname);
  dispatch(req, res, req.url);
});

server.listen(3000);
console.log("Server is running on port 3000.");


//router
function dispatch(req, res, url) {
  if (url == '/') {
    var absPath = path.join(root, INDEX_PATH);
    index(req, res, absPath);
  } else {
    var urls = url.split("/");
    if (urls[1] == "directories") {
      if (urls[2] == "show") {
        var relaPath = url.replace("directories/show", "");
        showDirectory(req, res, relaPath);
      } else if (urls[2] == "rename") {
        var relaPath = url.replace("directories/rename", "");
        renameDirectory(req, res, relaPath);
      }
    } else if (urls[1] == "files") {
    }
  }
}

//controller

function index(req, res, indexPath) {
  serveStatic(res, indexPath);
};

//directories/id
function showDirectory(req, res, relaPath) {
  try {
    var result = listSubDirectories(relaPath);
    var html = generateShowDirectoriesHtml(result);
    res.writeHead(200, {"content-type": 'text/html'})
    res.write(html);
    res.end();
  } catch (e) {
    notFound(res);
  }
};

function renameDirectory(req, res, oldPath, newPath) {
  var absOldPath = path.join(root, oldPath);
  var absNewPath = path.join(root, newPath);
  fs.renameSync(absOldPath, absNewPath);
}

function showFile(req, res, absPath) {
};

//model
function listSubDirectories(relaPath) {
  var absPath = path.join(root, relaPath);
  var itemList = fs.readdirSync(absPath);
  var results = [];
  for (var i in itemList) {
    console.log(itemList[i]);
    var filePath = path.join(absPath, itemList[i]);
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(
          {"name": itemList[i],
           "absPath": filePath,
           "parentPath": absPath,
           "relaPath": path.join(relaPath, itemList[i]),
           "type": "directory"
          });
    } else {
      results.push(
          {"name": itemList[i],
           "absPath": filePath,
           "parentPath": absPath,
           "relaPath": path.join(relaPath, itemList[i]),
           "type": "file"
          });
    }}
  return results;
};

function sendFile(res, filePath, fileContents) {
  res.writeHead(
      200,
      {"content-type": mime.lookup(path.basename(filePath))}
      );
  res.end(fileContents);
}

function serveStatic(res, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          notFound(res);
        } else {
          sendFile(res, absPath, data);
        }
      });
    } else {
      notFound(res);
    }
  });
};

//helper
function badRequest(res) {
  res.writeHead(400, {'Content-Type': 'text/plain'});
  res.write('Error 400: Bad Request');
  res.end();
}

function notFound(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: resource not found');
  res.end();
}

//view
function getTemplate(absPath){
  var buf = fs.readFileSync(absPath, "utf8");
  return buf.toString();
}

function generateShowDirectoriesHtml(itemList) {
  var body = '<h1>Directory List</h1>'
           + '<div id="wrapper-container">'
           + '<table>'
           + '<thead>'
           + '<tr>'
           + '<th>Name</th>'
           + '<th>show</th>'
           + '<th>rename</th>'
           + '<th>move</th>'
           + '<th>delete</th>'
           + '</tr>'
           + '</thead>'
           + '<tbody>';
           for (i in itemList) {
             if (itemList[i]["type"] == "file") {
               body     += '<tr class="file">'
                        + '<td>' + itemList[i]["name"] + '</td>'
                        + '<td>' + '<a href="/files/show' + itemList[i]["relaPath"] +'">' + 'show</a>' + '</td>'
                        + '<td>' + '<a href="/files/rename' + itemList[i]["relaPath"] +'">' + 'rename</a>' + '</td>'
                        + '<td>' + '<a href="/files/move' + itemList[i]["relaPath"] +'">' + 'move</a>' + '</td>'
                        + '<td>' + '<a href="/files/delete' + itemList[i]["relaPath"] +'">' + 'delete</a>' + '</td>'
                        + '</tr>';
             } else {
               body     += '<tr class="directory">'
                        + '<td>' + itemList[i]["name"] + '</td>'
                        + '<td>' + '<a href="/directories/show' + itemList[i]["relaPath"] +'">' + 'show</a>' + '</td>'
                        + '<td>' + '<a href="/directories/rename' + itemList[i]["relaPath"] +'">' + 'rename</a>' + '</td>'
                        + '<td>' + '<a href="/directories/move' + itemList[i]["relaPath"] +'">' + 'move</a>' + '</td>'
                        + '<td>' + '<a href="/directories/delete' + itemList[i]["relaPath"] +'">' + 'delete</a>' + '</td>'
                        + '</tr>';
             }
           }
           body +=
           + '</tbody>'
           + '</table>'
           + '</div>';
  return htmlTemplate.replace('%body',body);
}

function generateHtmlRename() {
  var body = '<div>'
           + '<form method="post">'
           + 'old name: <input type="text" name="oldname" placeholder="old name here" disabled><br>'
           + 'new name: <input type="text" name="newname">'
           + '<input type="submit" value="Submit">'
           + '</form>';
}

/*
function sendFile(res, filePath, fileContents) {
  res.writeHead(
      200,
      {"content-type": mime.lookup(path.basename(filePath))}
      );
  res.end(fileContents);
}
*/
