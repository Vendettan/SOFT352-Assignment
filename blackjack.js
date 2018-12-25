window.onload = function(evt)
{
  var queenofhearts = new Card("queen_of_hearts.png")
  var canvas = $("#dealerCanvas");
  var context = canvas[0].getContext("2d");
  context.drawImage(queenofhearts.image,0,0,50,80);

  getDeck();
}

class Card
{
  constructor(name)
  {
    var split = name.split("_");
    this.value = split[0].toLowerCase();
    var suitSplit = split[2].split(".");
    this.suit = suitSplit[0].toLowerCase();
    var img = document.createElement('img');
    img.src = "CardImages/" + name;
    this.image = img;
  }
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
