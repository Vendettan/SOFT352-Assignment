var io = require('socket.io')(9000);

// Variables for validation and player management
var playerCnt;
var serverCreated = false;
var executed = false;
var gameStarted = false;

// Arrays for connections and deck management
var connections = [];
var players = [];
var deck = [];
var dealer;

// Turn System
var currentTurn = 0;
var timeOut;
var turn = 0;
const MAX_WAIT = 10000;

  // Coords should automatically updte client-side
// Define coordinates for different gamemodes
// var dealerCoords = [490, 605];
// var play1 = [490, 605];
// var play2 = [280, 395, 700, 815];
// var play3 = [120, 235, 490, 605, 860, 975];
// var play4 = [85,200,355,470,625,740,895,1010];

io.sockets.on('connection', function(socket)
{
  // Get deck once
  if (executed == false)
  {
    GetDeck();
  }

  dealer = new Dealer();

  var address = socket.request.connection._peername.address.replace("::ffff:", "");
  // console.log("NEW CONNECTION from address: " + address);

  socket.on('add_player', function(userName)
  {
    if (serverCreated == true)
    {
      if (connections.length < playerCnt)
      {
        socket.emit('game_started');
        socket.id = "player" + connections.length;

        var newPlayer = new Player(socket, "", userName);
        connections.push(newPlayer);

        // Reset player IDs
        for (var i = 0; i < connections.length; i++)
        {
          connections[i].id = "player" + i;
        }

        // Coords should automatically updte client-side
        // Reset coords of players
        // if (playerCnt == 2)
        // {
        //   if (connections[0] != null)
        //   {
        //     connections[0].coords = [play2[2], play2[3]];
        //   }
        //   if (connections[1] != null)
        //   {
        //     connections[1].coords = [play2[0], play2[1]];
        //   }
        // }
        // else if (playerCnt == 3)
        // {
        //   if (connections[0] != null)
        //   {
        //     connections[0].coords = [play3[4], play3[5]];
        //   }
        //   if (connections[1] != null)
        //   {
        //     connections[1].coords = [play3[2], play3[3]];
        //   }
        //   if (connections[2] != null)
        //   {
        //     connections[2].coords = [play3[0], play3[1]];
        //   }
        // }
        // else if (playerCnt == 4)
        // {
        //   if (connections[0] != null)
        //   {
        //     connections[0].coords = [play4[6], play4[7]];
        //   }
        //   if (connections[1] != null)
        //   {
        //     connections[1].coords = [play4[4], play4[5]];
        //   }
        //   if (connections[2] != null)
        //   {
        //     connections[2].coords = [play4[2], play4[3]];
        //   }
        //   if (connections[3] != null)
        //   {
        //     connections[3].coords = [play4[0], play4[1]];
        //   }
        // }

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
    if (serverCreated == false)
    {
      console.log('PlayerCount = ' + playerCount);
      playerCnt = playerCount;
      socket.id = "player" + connections.length;

      // Coords should automatically updte client-side
      // var hostCoords;
      //
      // if (playerCount == 1)
      // {
      //   hostCoords = play1;
      // }
      // else if (playerCount == 2)
      // {
      //   hostCoords = [play2[2], play2[3]];
      // }
      // else if (playerCount == 3)
      // {
      //   hostCoords = [play3[4], play3[5]];
      // }
      // else if (playerCount == 4)
      // {
      //   hostCoords = [play4[6], play4[7]];
      // }

      var newPlayer = new Player(socket, "", userName);
      connections.push(newPlayer);

      for (var i = 0; i < connections.length; i++)
      {
        connections[i].id = "player" + i;
      }

      serverCreated = true;
      ShowConnections();

      socket.emit('show_host', playerCnt);
    }
    else
    {
      socket.emit('server_created');
    }
  });

  // User actions
  socket.on('hit', function()
  {
    // Search players
    for (var i in players)
    {
      // Find player
      if (socket.id == players[i].id)
      {
        Hit(i);
      }
    }
  });
  socket.on('stand', function()
  {
    // Passes turn
  });
  socket.on('double', function()
  {

  });
  socket.on('split', function()
  {

  });

  // At the start of the round
  socket.on('new_round', function()
  {
    console.log("NEW ROUND LOOK THIS IS CALLED WOOP");
    players = [];
    // Get all playing players
    currentTurn = 0;
    gameStarted = false;
    players = connections.slice();
    Deal();
  });

  socket.on('pass_turn', function()
  {
    // If players isn't null
    if (players.length != 0)
    {
      var tempCurrentTurn = currentTurn % players.length - 1;
      console.log("tempCurrentTurn before: " + tempCurrentTurn);
      if (tempCurrentTurn < 0)
      {
        if (gameStarted == true)
        {
          tempCurrentTurn = players.length - 1;
        }
        else
        {
          tempCurrentTurn = 0;
        }
      }
      console.log("tempCurrentTurn after: " + tempCurrentTurn);

      gameStarted = true;
      // If it's the players turn
      if (players[tempCurrentTurn].socket.id == socket.id)
      {
        ResetTimeout();
        players[tempCurrentTurn].socket.emit('turn_over');
        NextTurn();
      }
    }
  });

  socket.on('disconnect', function()
  {
    // Pass turn
    for (var i in players)
    {
      // Remove player that disconnects
      if (socket.id == players[i].id)
      {
        var tempCurrentTurn = (currentTurn - 1);

        if (tempCurrentTurn % players.length == i)
        {
          console.log('turn player disconnected');
          players.splice(i, 1);
          io.emit('pass_disconnect');
        }
        else
        {
          players.splice(i, 1);
        }
      }
    }

    // THEN remove connection that matches socket ID
    for (var i in connections)
    {
      // Remove connection
      if (socket.id == connections[i].id)
      {
        connections.splice(i, 1);
      }
    }

    console.log("Connection: " + socket.id + " has disconnected");
    ShowConnections();

    // If there are no connections, allow a new server to be created
    if (connections.length == 0)
    {
      serverCreated = false;
    }
  });
});

// Initiate next turn
function NextTurn()
{
  if (players.length != 0)
  {
    // If all players have played
    if (turn == (players.length - 1))
    {
      DealersTurn();
    }
    else
    {
      turn = currentTurn++ % players.length;
      players[turn].socket.emit('your_turn');
      console.log('next turn triggered: ', turn);
      StartTimeout();
    }
  }
}

// Start timeout that triggers next turn after wait time
function StartTimeout()
{
  console.log("start timeout");
  var count1 = 10000;
  timeOut = setTimeout(function()
  {
    // Don't emit if there are no connections
    if (players.length != 0)
    {
      if (players[turn] != undefined)
      {
        players[turn].socket.emit('turn_over');
      }
    }
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
    console.log("i = " + i);
    console.log(" j = " + j);

    // Store value at current index
    x = array[i];
    // Replace current index with random index value
    array[i] = array[j];
    // Replace random index value with temporary variable
    array[j] = x;
  }

  // Print deck
  // for (var i in deck)
  // {
  //   console.log(deck[i].name);
  // }
}

function Deal()
{
  // Get two cards
  for (var x = 0; x < 2; x++)
  {
    // For the dealer
    dealer.hand.push(GetCard());
    // And for every playing connected player
    for (var i in players)
    {
      players[i].hand.push(GetCard());
    }
  }

  UpdateHands();
}

function UpdateHands()
{
  var playerHands = [];

  var dealerHand = new Hand("dealer", dealer.hand);
  playerHands.push(dealerHand);

  for (var i in players)
  {
    var newHand = new Hand(players[i].id, players[i].hand, players[i].name);
    playerHands.push(newHand);
  }
  io.sockets.emit('deal', playerHands);
}

function DealersTurn()
{
  console.log("dealers turn");
  io.sockets.emit('dealer_turn');
  UpdateHands();

  // Hit while less than 17
  while (dealer.Total() < 17)
  {
    DealerHit();
    io.sockets.emit('dealer_turn');
    // UpdateHands();
  }

  // If soft 17, hit again
  if (dealer.Total() == 17)
  {
    for (var i in dealer.hand)
    {
      if (dealer.hand[i].name.includes("ace"))
      {
        while (dealer.Total() <= 21)
        {
          DealerHit();
          io.sockets.emit('dealer_turn');
          // UpdateHands();
        }
      }
    }
  }

  // If bust, emit dealer bust
  if (dealer.Total() > 21)
  {
    io.sockets.emit('dealer_bust');
  }
  else
  {
    io.sockets.emit('dealer_stand');
  }

  // End of dealers turn.
}

function DealerHit()
{
  setTimeout(function()
  {
    // Hit
    dealer.hand.push(GetCard());
  }, 1000);
}

function Hit(i)
{
  players[i].hand.push(GetCard());
  UpdateHands();
  if (CheckIfBust(i))
  {
    players[i].socket.emit('bust');
  }
  // Once called, can't double
}

function Split(i)
{

}

function CheckIfBust(i)
{
  console.log("Player total = " + players[i].Total());
  if (players[i].Total() > 21)
  {
    console.log("Bust");
    return true;
  }
  else
  {
    console.log("Not Bust");
    return false;
  }
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
    if (split[0] == "jack" || split[0] == "queen" || split[0] == "king")
    {
      this.weight = 10;
    }
    else if (split[0] == "ace")
    {
      this.weight = 11;
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

class Hand
{
  constructor(id, hand, name)
  {
    this.id = id;
    this.hand = hand;
    this.name = name;
  }
}

class Dealer
{
  constructor()
  {
    this.hand = [];
  }
  Total() // Totals the hand, updates as necessary when it contains aces
  {
    var count = 0;
    // Initial count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }

    // If player total is bust
    if (count > 21)
    {
      // For each card in hand
      for (var i in this.hand)
      {
        // If the card is an ace
        if (this.hand[i].name.includes("ace"))
        {
          // If the weight of the ace is still 11
          if (this.hand[i].weight == 11)
          {
            this.hand[i].weight = 1;
            break;
          }
        }
      }
    }

    count = 0;
    // Updated count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }
    return count;
  }
}

class Player
{
  constructor(socket, id, name, coords)
  {
    this.socket = socket;
    this.name = name;
    this.id = id;
    this.hand = [];
  }
  Total() // Totals the hand, updates as necessary when it contains aces
  {
    var count = 0;
    // Initial count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }

    // If player total is bust
    if (count > 21)
    {
      // For each card in hand
      for (var i in this.hand)
      {
        // If the card is an ace
        if (this.hand[i].name.includes("ace"))
        {
          // If the weight of the ace is still 11
          if (this.hand[i].weight == 11)
          {
            this.hand[i].weight = 1;
            break;
          }
        }
      }
    }

    count = 0;
    // Updated count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }
    console.log("Player Count = " + count);
    return count;
  }
}
