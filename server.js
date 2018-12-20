var WebSocketServer = require('websocket').server;
var http = require("http");

var s = http.createServer(function(request, response)
{
  console.log(new Date() + " - Received request");
});

s.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log("Received: " + message);
    ws.send(message);
  });
});
