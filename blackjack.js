var socket;

// Player coordinates used for creating table spaces
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


  // Initially disable action buttons
  // $('#').prop('disabled', true);
  $(".actions").find("button").attr("disabled", "disabled");
}

function JoinIP()
{
  if ($("#inputIP").val().trim() != "" && $("#userName").val().trim() != "")
  {
    var ip = $("#inputIP").val().trim();
    var name = $("#userName").val();

    socket = io('http://' + ip + ':' + "9000");

    socket.on("connect", function()
    {
      console.log("Client connected to server");
      socket.emit('add_player', name);
    });
    socket.on("no_server", function()
    {
      alert("No server has been created on this IP");
    });
    socket.on("server_full", function()
    {
      alert("The server you're trying to join is full");
    });

    $("#inputIP").val("");
    $("#userName").val("");

    socket.on('game_started', function()
    {
      $("#start").hide();
    });

    socket.on('show_players', function(playerCount)
    {
      PlayerSelect(playerCount);
    });
    $("#buttonJoinIP").attr("disabled");

    // Turn functions
    socket.on("your_turn", function()
    {
      console.log("Your Turn");
      // $(".actions :button").attr("disabled", false);
      $(".actions").find("button").removeAttr("disabled");
    });

    socket.on("turn_over", function()
    {
      console.log("Turn Over");
      // $(".actions :button").attr("disabled", true);
      $(".actions").find("button").attr("disabled", "disabled");
    });
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

    socket.on("connect_error", function()
    {
      alert("No server is running on this IP");
      socket.disconnect();
    });
    socket.on("connect", function()
    {
      console.log("Host Client connected to server");
      socket.emit('add_host', name, playerCount);
    });

    socket.on("server_created", function()
    {
      alert("A server has already been created on this IP");
    });

    socket.on("show_host", function()
    {
      PlayerSelect(playerCount);
    });

    // Turn functions
    socket.on("your_turn", function()
    {
      console.log("Your Turn");
      // $(".actions :button").attr("disabled", false);
      $(".actions").find("button").removeAttr("disabled");
    });
    socket.on("turn_over", function()
    {
      console.log("Turn Over");
      // $(".actions :button").attr("disabled", true);
      $(".actions").find("button").attr("disabled", "disabled");
    });

    $("#createInputIP").val("");
    $("#createUserName").val("");
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
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  if (users == 1)
  {
    context.rect(play1[0] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
  else if (users == 2)
  {
    context.rect(play2[0] - 10, 430, 240, 160);
    context.rect(play2[2] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
  else if (users == 3)
  {
    context.rect(play3[0] - 10, 430, 240, 160);
    context.rect(play3[2] - 10, 430, 240, 160);
    context.rect(play3[4] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
  else if (users == 4)
  {
    context.rect(play4[0] - 10, 430, 240, 160);
    context.rect(play4[2] - 10, 430, 240, 160);
    context.rect(play4[4] - 10, 430, 240, 160);
    context.rect(play4[6] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
}

// Show card at given position (TO BE ADDED: given card too)
function ShowCard(name, position)
{
  var cardImage = document.createElement('img');
  cardImage.src = "CardImages/Deck/" + name + ".png";

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
  return img;
}

function StartGame()
{
  $("#start").hide();
  socket.emit('new_round');
  socket.emit('pass_turn');
}

function Hit()
{
  socket.emit('hit');
  socket.on('hit_return', function(card, position)
  {
    ShowCard(card, position);
  });
}

function Stand()
{
  socket.emit('pass_turn');
}

function Double()
{
  socket.emit('double');
}

function Split()
{
  socket.emit('split');
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
