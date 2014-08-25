var http    = require('http');
var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var url     = require('url');

var root = __dirname;
var INDEX_PATH = "public/index.html";

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
      var relaPath = url.replace("directories/", "");
      var absPath = path.join(root, relaPath);
      showDirectory(req, res, absPath);
    }
  }
}

//controller

function index(req, res, indexPath) {
  serveStatic(res, indexPath);
};

//directories/id
function showDirectory(req, res, absPath) {
};

function showFile(req, res, absPath) {
};

//model
function listSubDirectories(absPath) {
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
/*
function writeFile() {
  var url = parse(req.url);
  var path = join(root, url.pathname);
  var stream = fs.createReadStream(path);
    stream.on('data', function(chunk){
      res.write(chunk);
    });
    stream.on('end', function(){
    res.end();
  });
}
*/
/*
var cache = {};

var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
  console.log("Server is listening on port 3000.");
});

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
      200,
      {"content-type": mime.lookup(path.basename(filePath))}
      );
  response.end(fileContents);
}

function serveStatic(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response);
        } else {
          sendFile(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}
*/
