var WebSocketServer = require('websocket').server;
var http = require("http");

var connections = {};

var server = http.createServer(function(request, response)
{
  console.log(new Date() + " - Received request");
});

server.listen(9000, function()
{
  console.log(new Date() + " - listening on port 9000");
});

var socket = new WebSocketServer({
  httpServer : server
});

socket.on("request", function(request)
{
  var connection = request.accept(null, request.origin);

  connection.on("close", function(reasonCode, description)
  {
    console.log(new Date() + " - Connection closed");
    connections.pop();
  });

  // Message & keeping track of connections
  connection.on("message", function(message)
  {
    console.log(message.utf8Data);
    connection.sendUTF(message.utf8Data);

    connections.push("Connection");
    for (var client in connections)
    {
      console.log(client);
    }
  });
});
