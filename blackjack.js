var socket;
var dealer = [490, 605];
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
  if ($("#inputIP").val().trim() != "" && $("#userName").val().trim() != "")
  {
    var ip = $("#inputIP").val();
    var name = $("#userName").val();

    socket = io('http://' + ip + ':' + "9000");
    // Error handling when IP is invalid/ server is offline
    // socket.on('connect_error', function()
    // {
    //   alert("Unable to connect to IP")
    // });
    socket.on("connect", function()
    {
      console.log("Client connected to server");
      socket.emit('add_player', name);
    });

    socket.on("purple", function()
    {
      console.log("yes its inbuilt");
    });

    $("#inputIP").val("");
    $("#userName").val("");
  }
  else
  {
    alert("Name and IP fields must be occupied");
  }
}

function CreateLobby()
{
  if ($("#createInputIP").val().trim() != "" && $("#createUserName").val().trim() != "")
  {
    var ip = $("#createInputIP").val();
    var name = $("#createUserName").val();
    var playerCount = $("input[name='player']:checked").val();

    socket = io('http://' + ip + ':' + "9000");
    // Error handling when IP is invalid/ server is offline
    // socket.on('connect_error', function()
    // {
    //   alert("Unable to connect to IP")
    // });
    socket.on("connect", function()
    {
      console.log("Host Client connected to server");
      socket.emit('add_host', name, playerCount);
    });

    $("#createInputIP").val("");
    $("#createUserName").val("");
    PlayerSelect(playerCount);
  }
  else
  {
    alert("Name and IP fields must be occupied");
  }
}

function PlayerSelect(users)
{
  ShowPlayers(users);
  ToggleMenu(0);
  ToggleCanvas(1);
}

// Show table spaces for each player according to selected game mode, get
// coordinates for each player for the selected game mode, and print some
// test cards for the host player
function ShowPlayers(users)
{
  console.log("show players");
  console.log("users: " + users);
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  switch(users)
  {
    case 1:
    console.log("case 1");
      // Table area
      context.rect(play1[0] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      // var player1 = new Player(0, "player1", "matt", play1, null);
      players.push(player1);
      socket.emit('')
    break;
    case 2:
    console.log("case 2");
      // Table areas
      context.rect(play2[0] - 10, 430, 240, 160);
      context.rect(play2[2] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      // var player1 = new Player(0, "player1", "matt", [play2[2], play2[3]], null);
      // var player2 = new Player(0, "player2", "jim", [play2[0], play2[1]], null);
      players.push(player1, player2);
      ShowCard(players[0].coords);
    break;
    case 3:
    console.log("case 3");
      // Table areas
      context.rect(play3[0] - 10, 430, 240, 160);
      context.rect(play3[2] - 10, 430, 240, 160);
      context.rect(play3[4] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      // var player1 = new Player(0, "player1", "matt", [play3[4], play3[5]], null);
      // var player2 = new Player(0, "player2", "jim", [play3[2], play3[3]], null);
      // var player3 = new Player(0, "player3", "bob", [play3[0], play3[1]], null);
      players.push(player1, player2, player3);
    break;
    case 4:
    console.log("case 4");
      // Table areas
      context.rect(play4[0] - 10, 430, 240, 160);
      context.rect(play4[2] - 10, 430, 240, 160);
      context.rect(play4[4] - 10, 430, 240, 160);
      context.rect(play4[6] - 10, 430, 240, 160);
      context.fillStyle = "014C12";
      context.fill();
      // Player creation
      // var player1 = new Player(0, "player1", "matt", [play4[6], play4[7]], null);
      // var player2 = new Player(0, "player2", "jim", [play4[4], play4[5]], null);
      // var player3 = new Player(0, "player3", "bob", [play4[2], play4[3]], null);
      // var player4 = new Player(0, "player4", "steve", [play4[0], play4[1]], null);
      players.push(player1, player2, player3, player4);
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
