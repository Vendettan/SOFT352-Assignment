var WebSocketServer = require('websocket').server;
var http = require("http");

var connections = [];
var deck = [];

var server = http.createServer(function(request, response)
{
  console.log(new Date() + " - Received request");
});

server.listen(9000, function()
{
  console.log(new Date() + " - listening on port 9000");
  GetDeck();
});

var socket = new WebSocketServer({
  httpServer : server
});

socket.on("request", function(request)
{
  counter = 1;
  var connection = request.accept(null, request.origin);
  for (var client in connections)
  {
    counter += 1;
  }
  connections.push(connection);

  console.log("NEW CONNECTION");

  // Send client the deck
  connection.emit("send deck");

  connection.on("close", function(reasonCode, description)
  {
    console.log(new Date() + " - Connection closed");
    connections.pop();
    ShowConnections();
  });
  ShowConnections();
});

function ShowConnections()
{
  console.log("Connections: " + connections.length);

  // for (var i in connections)
  // {
  //   console.log("Client: " + connections[i]);
  // }
}

function GetDeck()
{
  path = "CardImages/Deck"
  var fs = require("fs");
  files = fs.readdirSync(path);
  for (var i in files)
  {
    var tempCard = new Card(files[i]);
    deck.push(tempCard);
  }
  for (var i in deck)
  {
    console.log("card name = " + deck[i].value + " of " + deck[i].suit);
  }
}

class Player
{
  constructor(socket, id, name)
  {
    this.socket = socket;
    this.name = name;
    this.id = id;
  }
}

class Card
{
  constructor(name)
  {
    var split = name.split("_");
    this.value = split[0].toLowerCase();
    var suitSplit = split[2].split(".");
    this.suit = suitSplit[0].toLowerCase();
    this.image = null;
    // GetImage(name);
  }

  Send(command, message)
  {
    this.socket.emit(command, message);
  }
}
