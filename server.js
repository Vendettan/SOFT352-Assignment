var WebSocketServer = require('websocket').server;
var http = require("http");

var connections = [];

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
  connections.push("Connection");

  connection.on("close", function(reasonCode, description)
  {
    console.log(new Date() + " - Connection closed");
    connections.pop();
  });
  ShowConnections();
});

function ShowConnections()
{
  counter = 0;

  for (var client in connections)
  {
    counter += 1;
  }

  console.log("Connections: " + counter);
}

class Card
{
  constructor(name)
  {
    var split = name.split("_");
    this.value = split[0].toLowerCase();
    var suitSplit = split[2].split(".");
    this.suit = suitSplit[0].toLowerCase();
    var img = document.createElement('img');
    img.src = "CardImages/" + name;
    this.image = img;
  }
}
