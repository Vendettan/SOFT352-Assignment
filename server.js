// var WebSocketServer = require('websocket').server;
var io = require('socket.io')(9000);
// var http = require("http");

var connections = [];
var deck = [];

// var server = http.createServer(function(request, response)
// {
//   console.log(new Date() + " - Received request");
// });

// io.listen(server);

io.sockets.on('connection', function(socket)
{
  connections.push(socket);
  ShowConnections();

  socket.emit('connect');
  socket.emit('update', connections.length)

  socket.on('disconnect', function()
  {
    connections.pop();
    ShowConnections();
  });
})

function ShowConnections()
{
  console.log("Connections: " + connections.length);
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
