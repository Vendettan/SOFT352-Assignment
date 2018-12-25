function Card(value, suit)
{
  this.value = value;
  this.suit = suit;
  imageName = (value + "_of_" + suit);
  var img = document.createElement('img');
  img.src = "CardImages/" + imageName + ".png"
  this.image = img;
}

$(document).ready(function()
{
  var aceofspades = new Card("ace", "spades");
  var canvas = $("#dealerCanvas");
  var context = canvas[0].getContext("2d");
  context.drawImage(aceofspades.image,0,0,50,80);

  getDeck();
});

function getImage()
{



}

function getDeck()
{
  var deck = [];
  path = "CardImages/"

  var fs = require("fs");
  var files = fs.readdirSync('CardImages');
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
