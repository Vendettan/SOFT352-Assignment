var socket;
var playerCnt;

// Player coordinates used for creating table spaces
var dealer = [490];
var play1 = [490];
var play2 = [280, 700];
var play3 = [120, 490, 860];
var play4 = [85, 355, 625, 895];

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

    socket.on('deal', function(players)
    {
      console.log('players = ' + players);


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
    playerCnt = $("input[name='player']:checked").val();

    socket = io('http://' + ip + ':' + "9000");

    socket.on("connect_error", function()
    {
      alert("No server is running on this IP");
      socket.disconnect();
    });
    socket.on("connect", function()
    {
      console.log("Host Client connected to server");
      socket.emit('add_host', name, playerCnt);
    });

    socket.on("server_created", function()
    {
      alert("A server has already been created on this IP");
    });

    socket.on("show_host", function()
    {
      PlayerSelect(playerCnt);
    });

    socket.on('deal', function(playerHands)
    {
      console.log('players = ' + playerHands);

      for (var i in playerHands)
      {
        console.log("playerHands[" + i + "].id = " + playerHands[0].id);
        for (var x in playerHands[i].hand)
        {
          console.log("playerHands[" + i + "] hand = " + playerHands[i].hand[x].name);
          playerHands[i].hand[x].image = GetImage(playerHands[i].hand[x].name);
        }
      }
      // Wait for images to load before printing
      setTimeout(function()
      {
        for (var i in playerHands)
        {
          ShowHand(playerHands[i].hand, playerHands[i].id);
        }
      }, 200);

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
    context.rect(play2[1] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
  else if (users == 3)
  {
    context.rect(play3[0] - 10, 430, 240, 160);
    context.rect(play3[1] - 10, 430, 240, 160);
    context.rect(play3[2] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
  else if (users == 4)
  {
    context.rect(play4[0] - 10, 430, 240, 160);
    context.rect(play4[1] - 10, 430, 240, 160);
    context.rect(play4[2] - 10, 430, 240, 160);
    context.rect(play4[3] - 10, 430, 240, 160);
    context.fillStyle = "014C12";
    context.fill();
  }
}

// Show card at given position
function ShowHand(hand, playerID)
{
  console.log("playerID = " + playerID);

  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  if (playerCnt == 1)
  {
    var tempPlay1 = play1.slice();
    for (var i in hand)
    {
      console.log("hand[i].image = " + hand[i].image);
      context.drawImage(hand[i].image,tempPlay1[0],450,85,120);
      tempPlay1[0] += 20;
    }
  }
  // else if (users == 2)
  // {
  //   context.rect(play2[0] - 10, 430, 240, 160);
  //   context.rect(play2[2] - 10, 430, 240, 160);
  //   context.fillStyle = "014C12";
  //   context.fill();
  // }
  // else if (users == 3)
  // {
  //   context.rect(play3[0] - 10, 430, 240, 160);
  //   context.rect(play3[2] - 10, 430, 240, 160);
  //   context.rect(play3[4] - 10, 430, 240, 160);
  //   context.fillStyle = "014C12";
  //   context.fill();
  // }
  // else if (users == 4)
  // {
  //   context.rect(play4[0] - 10, 430, 240, 160);
  //   context.rect(play4[2] - 10, 430, 240, 160);
  //   context.rect(play4[4] - 10, 430, 240, 160);
  //   context.rect(play4[6] - 10, 430, 240, 160);
  //   context.fillStyle = "014C12";
  //   context.fill();
  // }
}

function GetImage(name)
{
  var img = document.createElement('img');
  img.src = "CardImages/Deck/" + name + ".png";
  return img;
}

function StartGame()
{
  $("#start").hide();
  socket.emit('new_round');
  // socket.emit('pass_turn');
}

function Hit()
{
  socket.emit('hit');
  socket.on('hit_return', function(card, position)
  {

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
