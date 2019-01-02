var io = require('socket.io')(9000);

var playerCnt;
var serverCreated = false;
var executed = false;
var connections = [];
var deck = [];

// Define coordinates for different gamemodes
var dealer = [490, 605];
var play1 = [490, 605];
var play2 = [280, 395, 700, 815];
var play3 = [120, 235, 490, 605, 860, 975];
var play4 = [85,200,355,470,625,740,895,1010];

io.sockets.on('connection', function(socket)
{
  // Get deck once
  if (executed == false)
  {
    GetDeck();
  }

  var address = socket.request.connection._peername.address;
  console.log("New connection from address: " + address);

  socket.on('add_player', function(userName)
  {
    if (serverCreated == true)
    {
      if (connections.length < playerCnt)
      {
        console.log('UserName = ' + userName);
        socket.id = "player" + connections.length;

        // Set coords of players
        // (Needs to know how many connections there are)
        // switch(playerCount)
        // {
        //   case 1:
        //   connections[0].coords = play1;
        //   break;
        //   case 2:
        //   connections[0].coords = [play2[2], play2[3]];
        //   connections[1].coords = [play2[0], play2[1]];
        //   break;
        //   case 3:
        //   connections[0].coords = [play3[4], play3[5]];
        //   connections[1].coords = [play3[2], play3[3]];
        //   connections[2].coords = [play3[0], play3[1]];
        //   break;
        //   case 4:
        //   connections[0].coords = [play4[6], play4[7]];
        //   connections[1].coords = [play4[4], play4[5]];
        //   connections[2].coords = [play4[2], play4[3]];
        //   connections[3].coords = [play4[0], play4[1]];
        //   break;
        // }

        var newPlayer = new Player(socket, socket.id, userName);

        connections.push(newPlayer);
      }
      else
      {
        socket.emit('server_full');
      }
    }
    else
    {
      socket.emit('no_server');
    }

    ShowConnections();
  });

  socket.on('add_host', function(userName, playerCount)
  {
    console.log('UserName = ' + userName);
    console.log('PlayerCount = ' + playerCount);
    playerCnt = playerCount;
    socket.id = "player" + connections.length;

    var hostCoords;

    if (playerCount == 1)
    {
      hostCoords = play1;
    }
    else if (playerCount == 2)
    {
      hostCoords = [play2[2], play2[3]];
    }
    else if (playerCount == 3)
    {
      hostCoords = [play3[4], play3[5]];
    }
    else if (playerCount == 4)
    {
      hostCoords = [play4[6], play4[7]];
    }

    var newPlayer = new Player(socket, socket.id, userName, hostCoords);

    connections.push(newPlayer);

    serverCreated = true;

    ShowConnections();
  });

  socket.on('disconnect', function()
  {
    connections.pop();
    console.log("Connection: " + address + " has disconnected");
    ShowConnections();
    socket.emit('update', connections.length);
  });
})

function ShowConnections()
{
  console.log("Connections: " + connections.length);

  for (var i in connections)
  {
    console.log(" Connection " + i + ": " + connections[i].id);
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
  constructor(socket, id, name, coords)
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
