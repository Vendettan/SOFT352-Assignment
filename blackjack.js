window.onload = function(evt)
{
  var queenofhearts = new Card("queen_of_hearts.png")
  var canvas = $("#dealerCanvas");
  var context = canvas[0].getContext("2d");
  context.drawImage(queenofhearts.image,0,0,50,80);

  getDeck();
}




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
