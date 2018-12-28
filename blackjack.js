var socket = new WebSocket("ws://localhost:9000");

var deck = [];

socket.on("connect", function(connection)
{
  console.log("entered connect");
  connection.on("send deck", function(data)
  {
    // deck = data;
    console.log(deck);
  });
});

socket.on("send deck", function(data)
{
  console.log("entered send deck");
  deck = data;
  console.log(deck);
});

window.onload = function(evt)
{
  // For all cards, get images

  // var canvas = $("#MainCanvas");
  // var context = canvas[0].getContext("2d");
  // context.drawImage(queenofhearts.image,0,0,50,80);
}

function GetImage(name)
{
  var img = document.createElement('img');
  img.src = "CardImages/" + name;
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
