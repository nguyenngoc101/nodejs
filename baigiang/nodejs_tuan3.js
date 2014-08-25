//Node js Blocking and Non-Blocking
// Load the http module to create an http server.
var fs = require('fs');
fs.readdir(__dirname, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    for (var i = 0; i < data.length; i++) {
      if (fs.lstatSync(data[i]).isFile()) {
        console.log(data[i]);
      } else {
        console.log('[' + data[i] + ']');
      }
    }
    console.log(data);
  }
});

/*
fs.stat('test.js', function (err, data){
});
/*
var http = require('http');
var fs = require('fs');

fs.readFile('test.js', {"encoding": 'uft8'}, function (err, data){
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
/*
var server = http.createServer(function (request, response) {
  response.write(str);
  response.end();
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
*/
