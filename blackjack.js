var socket;
var deck = [];
var connections;
var players = [];

// Define coordinates for future reference
var dealer = [490, 605];
var play1 = [490, 605];
var play2 = [280, 395, 700, 815];
var play3 = [120, 235, 490, 605, 860, 975];
var play4 = [85,200,355,470,625,740,895,1010];

window.onload = function(evt)
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  // Deck
  var deckImage = document.createElement('img');
  deckImage.src = "CardImages/deck_bordered.png";
  context.drawImage(deckImage,20,20,135,170);
  // Dealer
  context.rect(dealer[0] - 10, 10, 240, 160);
  context.fillStyle = "#014C12";
  context.fill();

  // Hide game & UI elements
  $(".game").hide();
  $("#buttonCreate").click(function()
  {
    ToggleCreate(1);
    ToggleJoin(0);
  });
  $("#buttonJoin").click(function()
  {
    ToggleJoin(1);
    ToggleCreate(0);
  });
}

function JoinIP()
{
  var ip = $("#inputIP").val();
  socket = io('http://' + ip + ':' + "9000");
  socket.on("connect", function()
  {
    console.log("Client connected to server");
  });
  $("#inputIP").val("");
}

function PlayerSelect(users)
{
  players = [];
  ShowPlayers(users);
  ToggleMenu(0);
  ToggleCanvas(1);
}

// Show table spaces for each player according to selected game mode, get
// coordinates for each player for the selected game mode, and print some
// test cards for the host player
function ShowPlayers(users)
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  switch(users)
  {
    case 1:
      // Table area
      context.rect(play1[0] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      var player1 = new Player(0, "player1", "matt", play1, null);
      players.push(player1);
      ShowCard(players[0].coords);
    break;
    case 2:
      // Table areas
      context.rect(play2[0] - 10, 430, 240, 160);
      context.rect(play2[2] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      var player1 = new Player(0, "player1", "matt", [play2[2], play2[3]], null);
      var player2 = new Player(0, "player2", "jim", [play2[0], play2[1]], null);
      players.push(player1, player2);
      ShowCard(players[0].coords);
    break;
    case 3:
      // Table areas
      context.rect(play3[0] - 10, 430, 240, 160);
      context.rect(play3[2] - 10, 430, 240, 160);
      context.rect(play3[4] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      var player1 = new Player(0, "player1", "matt", [play3[4], play3[5]], null);
      var player2 = new Player(0, "player2", "jim", [play3[2], play3[3]], null);
      var player3 = new Player(0, "player3", "bob", [play3[0], play3[1]], null);
      players.push(player1, player2, player3);
      ShowCard(players[0].coords);
    break;
    case 4:
      // Table areas
      context.rect(play4[0] - 10, 430, 240, 160);
      context.rect(play4[2] - 10, 430, 240, 160);
      context.rect(play4[4] - 10, 430, 240, 160);
      context.rect(play4[6] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      var player1 = new Player(0, "player1", "matt", [play4[6], play4[7]], null);
      var player2 = new Player(0, "player2", "jim", [play4[4], play4[5]], null);
      var player3 = new Player(0, "player3", "bob", [play4[2], play4[3]], null);
      var player4 = new Player(0, "player4", "steve", [play4[0], play4[1]], null);
      players.push(player1, player2, player3, player4);
      ShowCard(players[0].coords);
    break;
  }
}

// Show card at given position (TO BE ADDED: given card too)
function ShowCard(position)
{
  var cardImage = document.createElement('img');
  cardImage.src = "CardImages/Deck/2_of_clubs.png";

  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  context.drawImage(cardImage,position[0],440,105,140);
  context.drawImage(cardImage,position[1],440,105,140);
}

function GetImage(name)
{
  var img = document.createElement('img');
  img.src = "CardImages/Deck" + name;
  this.image = img;
}

function Hit()
{

}

function Stand()
{

}

function DoubleDown()
{

}

function Split()
{

}

function Bet()
{

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
  }
}

// Toggle functions with boolean inputs for error validation
function ToggleMenu(bool)
{
  if (bool == 1)
  {
    $(".lobby").show();
  }
  else
  {
    $(".lobby").hide();
  }
}

function ToggleCanvas(bool)
{
  if (bool == 1)
  {
    $(".game").show();
  }
  else
  {
    $(".game").hide();
  }
}

function ToggleCreate(bool)
{
  if (bool == 1)
  {
    $(".create").show();
  }
  else
  {
    $(".create").hide();
  }
}

function ToggleJoin(bool)
{
  if (bool == 1)
  {
    $(".join").show();
  }
  else
  {
    $(".join").hide();
  }
}
