var socket;
var deck = [];
var connections;

// Define coordinates for future reference
var dealer = [490, 605];
var play1 = [490, 605];
var play2 = [280, 395, 700, 815];
var play3 = [120, 235, 490, 605, 860, 975];
var play4 = [85,200,355,470,625,740,895,1010];

window.onload = function(evt)
{
  CreateNetwork();
  ShowPlayers();
  ShowCards();

  // Get game menu
  var game = $(".game");
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  // Deck
  var deckImage = document.createElement('img');
  deckImage.src = "CardImages/deck_bordered.png";
  context.drawImage(deckImage,20,20,135,170);
  // Dealer
  context.rect(dealer[0] - 10, 10, 240, 160);
  context.fillStyle = "014C12";
  context.fill();

  // Hide game & UI elements
  game.hide();
  $(".create").hide();
  // Toggle create menu
  $("#buttonCreate").click(function(){
    $(".create").toggle();
    ToggleCreateBorder();
  });
}

function CreateNetwork()
{
  socket = io("http://localhost:9000");
  socket.on("connect", function()
  {
    console.log("Client connected to server");
  });
  socket.on("update", function(data)
  {
    connections = data;
    console.log("Data = " + connections);
    ShowPlayers();
    ShowCards();
  });
}

function ToggleCreateBorder()
{
  if ($(".create").style.height == 70)
  {
    $(".create").style.height == 190;
  }
  else
  {
    $(".create").style.height == 70;
  }
}

function ToggleMenu()
{
  $(".lobby").toggle();
}

function ToggleCanvas()
{
  $(".game").toggle();
}




function ShowPlayers()
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  switch(connections)
  {
    case 1:
      context.rect(play1[0] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
    break;
    case 2:
      context.rect(play2[0] - 10, 430, 240, 160);
      context.rect(play2[2] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
    break;
    case 3:
      context.rect(play3[0] - 10, 430, 240, 160);
      context.rect(play3[2] - 10, 430, 240, 160);
      context.rect(play3[4] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
    break;
    case 4:
      context.rect(play4[0] - 10, 430, 240, 160);
      context.rect(play4[2] - 10, 430, 240, 160);
      context.rect(play4[4] - 10, 430, 240, 160);
      context.rect(play4[6] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
    break;
  }
}

function ShowCards()
{
  var cardImage = document.createElement('img');
  cardImage.src = "CardImages/Deck/2_of_clubs.png";

  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  // Players
  switch(connections)
  {
    case 1:
      context.drawImage(cardImage,play1[0],440,105,140);
      context.drawImage(cardImage,play1[1],440,105,140);
    break;
    case 2:
      context.drawImage(cardImage,play2[0],440,105,140);
      context.drawImage(cardImage,play2[1],440,105,140);
      context.drawImage(cardImage,play2[2],440,105,140);
      context.drawImage(cardImage,play2[3],440,105,140);
    break;
    case 3:
      context.drawImage(cardImage,play3[0],440,105,140);
      context.drawImage(cardImage,play3[1],440,105,140);
      context.drawImage(cardImage,play3[2],440,105,140);
      context.drawImage(cardImage,play3[3],440,105,140);
      context.drawImage(cardImage,play3[4],440,105,140);
      context.drawImage(cardImage,play3[5],440,105,140);
    break;
    case 4:
      context.drawImage(cardImage,play4[0],440,105,140);
      context.drawImage(cardImage,play4[1],440,105,140);
      context.drawImage(cardImage,play4[2],440,105,140);
      context.drawImage(cardImage,play4[3],440,105,140);
      context.drawImage(cardImage,play4[4],440,105,140);
      context.drawImage(cardImage,play4[5],440,105,140);
      context.drawImage(cardImage,play4[6],440,105,140);
      context.drawImage(cardImage,play4[7],440,105,140);
    break;
  }
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
