// var WebSocketServer = require('websocket').server;
var io = require('socket.io')(9000);
// var http = require("http");
var executed = false;
var connections = [];
var deck = [];

// var server = http.createServer(function(request, response)
// {
//   console.log(new Date() + " - Received request");
// });

// io.listen(server);

io.sockets.on('connection', function(socket)
{
  // Get deck once
  if (executed == false)
  {
    GetDeck();
  }

  socket.emit('connect');

  var address = socket.request.connection._peername.address;
  console.log("New connection from address: " + address);
  socket.on('add_player', function(userName)
  {
    console.log('UserName = ' + userName);
    socket.id = "player" + connections.length;
    console.log("Socket ID = " + socket.id);
    var newPlayer = new Player(socket, socket.id, userName, "", null);
    connections.push(newPlayer);
  });

  socket.on('disconnect', function()
  {
    connections.pop();
    ShowConnections();
    console.log("Connection: " + address + " has disconnected");
    socket.emit('update', connections.length);
  });
  ShowConnections();
})

function ShowConnections()
{
  console.log("Connections: " + connections.length);

  for (var i in connections)
  {
    // Add id print
  }
}

function GetDeck()
{
  executed = true;
  path = "CardImages/Deck"
  var fs = require("fs");
  files = fs.readdirSync(path);
  for (var i in files)
  {
    var tempCard = new Card(files[i]);
    deck.push(tempCard);
  }
  Shuffle(deck);
  console.log(deck);
}

function Shuffle(array)
{
  var x, j;
  for (var i = deck.length - 1; i > 0; i--)
  {
    // Get random index
    j = Math.floor(Math.random() * (i + 1));
    // Store value at current index
    x = array[i];
    // Replace current index with random index value
    array[i] = array[j];
    // Replace random index value with temporary variable
    array[j] = x;
  }
}

class Card
{
  constructor(name)
  {
    var split = name.split("_");
    this.value = split[0].toLowerCase();
    if (split[0] == "jack" || split[0] == "queen" || split[0] == "king" || split[0] == "ace")
    {
      this.weight = 10;
    }
    else
    {
      this.weight = split[0];
    }
    var suitSplit = split[2].split(".");
    this.suit = suitSplit[0].toLowerCase();
    this.image = null; // Image found client-side
  }
}

class Player
{
  constructor(socket, id, name, coords, hand)
  {
    this.socket = socket;
    this.name = name;
    this.id = id;
    this.coords = coords;
    this.hand = [];
    this.total = function()
    {
      var count = 0;
      for (var i in hand)
      {
        count += hand[i].weight;
      }
      return count;
    }
  }
}
