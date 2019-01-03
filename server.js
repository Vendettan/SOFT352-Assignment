var io = require('socket.io')(9000);

// Variables for validation and player management
var playerCnt;
var serverCreated = false;
var executed = false;
var gameStarted = false;

// Arrays for connections and deck management
var connections = [];
var deck = [];

// Turn System
var currentTurn = 0;
var timeOut;
var turn = 0;
const MAX_WAIT = 5000;

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

  var address = socket.request.connection._peername.address.replace("::ffff:", "");
  console.log("NEW CONNECTION from address: " + address);

  socket.on('add_player', function(userName)
  {
    if (serverCreated == true)
    {
      if (connections.length < playerCnt)
      {
        socket.emit('game_started');
        console.log('UserName = ' + userName);
        socket.id = "player" + connections.length;

        var newPlayer = new Player(socket, "", userName);
        connections.push(newPlayer);

        // Reset player IDs
        for (var i = 0; i < connections.length; i++)
        {
          connections[i].id = "player" + i;
        }

        // Reset coords of players
        if (playerCnt == 2)
        {
          if (connections[0] != null)
          {
            connections[0].coords = [play2[2], play2[3]];
            console.log("Connection 1 coords = " + connections[0].coords);
          }
          if (connections[1] != null)
          {
            connections[1].coords = [play2[0], play2[1]];
            console.log("Connection 2 coords = " + connections[1].coords);
          }
        }
        else if (playerCnt == 3)
        {
          if (connections[0] != null)
          {
            connections[0].coords = [play3[4], play3[5]];
            console.log("Connection 1 coords = " + connections[0].coords);
          }
          if (connections[1] != null)
          {
            connections[1].coords = [play3[2], play3[3]];
            console.log("Connection 2 coords = " + connections[1].coords);
          }
          if (connections[2] != null)
          {
            connections[2].coords = [play3[0], play3[1]];
            console.log("Connection 3 coords = " + connections[2].coords);
          }
        }
        else if (playerCnt == 4)
        {
          if (connections[0] != null)
          {
            connections[0].coords = [play4[6], play4[7]];
            console.log("Connection 1 coords = " + connections[0].coords);
          }
          if (connections[1] != null)
          {
            connections[1].coords = [play4[4], play4[5]];
            console.log("Connection 2 coords = " + connections[1].coords);
          }
          if (connections[2] != null)
          {
            connections[2].coords = [play4[2], play4[3]];
            console.log("Connection 3 coords = " + connections[2].coords);
          }
          if (connections[3] != null)
          {
            connections[3].coords = [play4[0], play4[1]];
            console.log("Connection 4 coords = " + connections[3].coords);
          }
        }

        socket.emit('show_players', playerCnt);
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
    console.log("tries to add a host");
    if (serverCreated == false)
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

      var newPlayer = new Player(socket, "", userName, hostCoords);
      connections.push(newPlayer);

      for (var i = 0; i < connections.length; i++)
      {
        connections[i].id = "player" + i;
      }

      serverCreated = true;
      ShowConnections();

      socket.emit('show_host', playerCnt);

      // var newCard = GetCard();
    }
    else
    {
      socket.emit('server_created');
    }
  });

  // User actions
  socket.on('hit', function()
  {


  });
  socket.on('stand', function()
  {

  });
  socket.on('double', function()
  {

  });
  socket.on('split', function()
  {

  });

  socket.on('pass_turn', function()
  {
    gameStarted = true;
    if (connections.length != 0)
    {
      if (connections[turn].socket.id == socket.id)
      {
        ResetTimeout();
        connections[turn].socket.emit('turn_over');
        NextTurn();
      }
    }

  });

  socket.on('disconnect', function()
  {
    // Remove connection that matches socket ID
    for (var i in connections)
    {
      // console.log("Socket " + i + " ID = " + socket.id);
      // console.log("Connection " + i + " ID = " + connections[i].id);
      if (turn != 0)
      {
        turn--;
      }

      if (socket.id == connections[i].id)
      {
        connections.splice(i, 1);
      }
    }
    console.log("Connection: " + address + " has disconnected");
    ShowConnections();

    // If there are no connections, allow a new server to be created
    if (connections.length == 0)
    {
      serverCreated = false;
    }
  });
})

// Initiate next turn
function NextTurn()
{
  if (connections.length != 0)
  {
    // If all players have played
    if (turn == (connections.length - 1))
    {
      DealersTurn();
    }
    else
    {
      turn = currentTurn++ % connections.length;
      connections[turn].socket.emit('your_turn');
      console.log('next turn triggered: ', turn);
      StartTimeout();
    }
  }
}

// Start timeout that triggers next turn after wait time
function StartTimeout()
{
  console.log("start timeout");
  timeOut = setTimeout(function ()
  {
    connections[turn].socket.emit('turn_over');
    NextTurn();
  }, MAX_WAIT);
}

// Reset the timeout on
function ResetTimeout()
{
  console.log("reset timeout");
  clearTimeout(timeOut);
}

function ShowConnections()
{
  console.log("vvvvvvvvvvv");
  console.log("Connections: " + connections.length);

  for (var i = 0; i< connections.length; i++)
  {
    console.log(" Connection " + i + ": " + connections[i].id);
  }
  console.log("^^^^^^^^^^^");
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
  console.log("=== DECK SHUFFLED ===\n") ;
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

function Deal()
{

}

function DealersTurn()
{
  console.log("dealers turn");
}

function GetCard()
{
  var card = deck.pop();
  return card;
}

class Card
{
  constructor(name)
  {
    this.name = name.split(".")[0];;
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

class Dealer
{
  constructor()
  {
    this.hand = [];
    this.coords = [490, 605];
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
