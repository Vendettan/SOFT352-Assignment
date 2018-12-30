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
  var deckImage = document.createElement('img');
  deckImage.src = "CardImages/deck_bordered.png";
  var cardImage = document.createElement('img');
  cardImage.src = "CardImages/Deck/2_of_clubs.png";

  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  // Deck
  context.drawImage(deckImage,10,10,135,170);
  // Dealer
  context.drawImage(cardImage,dealer[0],10,105,140);
  context.drawImage(cardImage,dealer[1],10,105,140);
  // Players
  ShowPlayers();
  context.drawImage(cardImage,play4[0],450,105,140);
  context.drawImage(cardImage,play4[1],450,105,140);
  context.drawImage(cardImage,play4[2],450,105,140);
  context.drawImage(cardImage,play4[3],450,105,140);
  context.drawImage(cardImage,play4[4],450,105,140);
  context.drawImage(cardImage,play4[5],450,105,140);
  context.drawImage(cardImage,play4[6],450,105,140);
  context.drawImage(cardImage,play4[7],450,105,140);
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
    console.log("Data = " + data);
  });
}

function ShowPlayers()
{

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
