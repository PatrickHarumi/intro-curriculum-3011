'use strict';
const http = require('node:http');
const path = require('node:path');
const url = require('node:url');
const fs = require('node:fs');
const port = 8000;
const mineTypes = {
  '.js'   : 'text/javascript',
  '.html' : 'text/html',
  '.css'  : 'text/css'
};
const whiteList = [
  './',
  './index.html'
];

const server = http.createServer((request, response) => {
  let lookup = decodeURI(request.url);
  lookup = path.normalize(lookup);
  console.log(`Request "${lookup}" was recieved on port ${port}`);
  if (lookup === '/favicon.ico') {
    response.end();
    return;
  };
  let fileName = (lookup === '/') ? './index.html' : `.${lookup}`;
  if (whiteList.indexOf(fileName) === -1){
    response.writeHead(404);
    response.end('ページが見つかりません');
    return;
  };
  console.log(`To check file "${fileName}" with .stat method`);
  fs.stat(fileName,function(err, status){
    if (err) {
      response.writeHead(500);
      response.end('server error!');
      return;
    }
    if (!status){
      response.writeHead(404);
      response.end('page not found!');
      return;
    }
    fs.readFile(fileName, function (err,data){
      if (err) {
        response.writeHead(500);
        response.end('file read error!');
        return;
      }
      response.writeHead(200, {'Content-Type': mineTypes[path.extname(fileName)]});
//      response.write(request.headers['user-agent']);
      response.end(data); 
    });
  });
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});