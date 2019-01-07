var socket;
var playerCnt;
var dealerTurn = false;

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
  setTimeout(function()
  {
    context.drawImage(deckImage,20,20,135,170);
  },100);
  // Dealer
  context.fillStyle = "#014C12";
  context.fillRect(dealer[0] - 10, 10, 240, 160);
  context.fillStyle = "white";
  context.font = "20px Trebuchet MS"
  context.fillText("Dealer",dealer[0]+80,30);

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
      $("#buttonStart").hide();
    });

    socket.on('show_players', function(playerCount)
    {
      PlayerSelect(playerCount);
      playerCnt = playerCount;
    });

    socket.on('deal', function(playerHands)
    {
      for (var i in playerHands)
      {
        for (var x in playerHands[i].hand)
        {
          playerHands[i].hand[x].image = GetImage(playerHands[i].hand[x].name);
        }
      }
      // Wait for images to load before printing
      setTimeout(function()
      {
        for (var i in playerHands)
        {
          if (playerHands[i].id == "dealer")
          {
            ShowDealer(playerHands[i].hand);
          }
          else
          {
            ShowHand(playerHands[i].hand, playerHands[i].id, playerHands[i].name, playerHands[i].total);
          }
        }
      }, 200);
    });

    // Turn functions
    socket.on("your_turn", function()
    {
      console.log("Your Turn");
      $(".actions").find("button").removeAttr("disabled");
    });
    socket.on("turn_over", function()
    {
      console.log("Turn Over");
      $(".actions").find("button").attr("disabled", "disabled");
    });

    socket.on('bust', function()
    {
      console.log("B U S T");
      socket.emit('pass_turn');
    });

    socket.on('dealer_turn', function()
    {
      dealerTurn = true;
      ShowDealer();
    });

    socket.on('dealer_bust', function()
    {
      console.log("dealer BUST");
    });

    socket.on('dealer_stand', function()
    {
      console.log('dealer STAND');
    });

    socket.on('pass_disconnect', function()
    {
      console.log("pass disconnect");
      socket.emit('pass_turn');
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
      for (var i in playerHands)
      {
        for (var x in playerHands[i].hand)
        {
          playerHands[i].hand[x].image = GetImage(playerHands[i].hand[x].name);
        }
      }
      // Wait for images to load before printing
      setTimeout(function()
      {
        for (var i in playerHands)
        {
          if (playerHands[i].id == "dealer")
          {
            ShowDealer(playerHands[i].hand);
          }
          else
          {
            ShowHand(playerHands[i].hand, playerHands[i].id, playerHands[i].name, playerHands[i].total);
          }
        }
      }, 200);
    });

    // Turn functions
    socket.on("your_turn", function()
    {
      console.log("Your Turn");
      $(".actions").find("button").removeAttr("disabled");
    });
    socket.on("turn_over", function()
    {
      console.log("Turn Over");
      $(".actions").find("button").attr("disabled", "disabled");
    });

    socket.on('bust', function()
    {
      console.log("B U S T");
      socket.emit('pass_turn');
    });

    socket.on('dealer_turn', function()
    {
      dealerTurn = true;
      ShowDealer();
    });

    socket.on('dealer_bust', function()
    {
      console.log("dealer BUST");
    });

    socket.on('dealer_stand', function()
    {
      console.log('dealer STAND');
    });

    socket.on('end_game', function()
    {
      console.log("end game");
      $("#buttonStart").show();
    });

    socket.on('pass_disconnect', function()
    {
      console.log("pass disconnect");
      socket.emit('pass_turn');
    });

    $("#createInputIP").val("");
    $("#createUserName").val("");
  }
  else
  {
    alert("Name and IP fields must be occupied");
  }
}

function ResetCanvas()
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");
  // Deck
  var deckImage = document.createElement('img');
  deckImage.src = "CardImages/deck_bordered.png";
  setTimeout(function()
  {
    context.drawImage(deckImage,20,20,135,170);
  },100);
  // Dealer
  context.fillStyle = "#014C12";
  context.fillRect(dealer[0] - 10, 10, 240, 160);
  context.fillStyle = "white";
  context.font = "20px Trebuchet MS"
  context.fillText("Dealer",dealer[0]+80,30);

  PlayerSelect(playerCnt);
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
  context.fillStyle = "#014C12";
  if (users == 1)
  {
    context.rect(play1[0] - 10, 430, 240, 160);
    context.fill();
  }
  else if (users == 2)
  {
    context.rect(play2[0] - 10, 430, 240, 160);
    context.rect(play2[1] - 10, 430, 240, 160);
    context.fill();
  }
  else if (users == 3)
  {
    context.rect(play3[0] - 10, 430, 240, 160);
    context.rect(play3[1] - 10, 430, 240, 160);
    context.rect(play3[2] - 10, 430, 240, 160);
    context.fill();
  }
  else if (users == 4)
  {
    context.rect(play4[0] - 10, 430, 240, 160);
    context.rect(play4[1] - 10, 430, 240, 160);
    context.rect(play4[2] - 10, 430, 240, 160);
    context.rect(play4[3] - 10, 430, 240, 160);
    context.fill();
  }
}

// Show card at given position
function ShowHand(hand, playerID, userName, total)
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  // Print player hands
  if (playerCnt == 1)
  {
    var tempPlay1 = play1.slice();
    if (playerID == "player0")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay1[0]+20,450);

      // Update total
      context.clearRect(tempPlay1[0]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay1[0]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay1[0]+200,450);
    }
    for (var i in hand)
    {
      context.drawImage(hand[i].image,tempPlay1[0],460,85,120);
      tempPlay1[0] += 20;
    }
  }
  else if (playerCnt == 2)
  {
    var tempPlay2 = play2.slice();
    if (playerID == "player0")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay2[0]+20,450);
      // Update total
      context.clearRect(tempPlay2[0]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay2[0]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay2[0]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay2[0],460,85,120);
        tempPlay2[0] += 20;
      }
    }
    else if (playerID == "player1")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay2[1]+20,450);
      // Update total
      context.clearRect(tempPlay2[1]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay2[1]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay2[1]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay2[1],460,85,120);
        tempPlay2[1] += 20;
      }
    }
  }
  else if (playerCnt == 3)
  {
    var tempPlay3 = play3.slice();
    if (playerID == "player0")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay3[0]+20,450);
      // Update total
      context.clearRect(tempPlay3[0]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay3[0]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay3[0]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay3[0],460,85,120);
        tempPlay3[0] += 20;
      }
    }
    else if (playerID == "player1")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay3[1]+20,450);
      // Update total
      context.clearRect(tempPlay3[1]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay3[1]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay3[1]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay3[1],460,85,120);
        tempPlay3[1] += 20;
      }
    }
    else if (playerID == "player2")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay3[2]+20,450);
      // Update total
      context.clearRect(tempPlay3[2]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay3[2]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay3[2]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay3[2],460,85,120);
        tempPlay3[2] += 20;
      }
    }
  }
  else if (playerCnt == 4)
  {
    var tempPlay4 = play4.slice();
    if (playerID == "player0")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay4[0]+20,450);
      // Update total
      context.clearRect(tempPlay4[0]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay4[0]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay4[0]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay4[0],460,85,120);
        tempPlay4[0] += 20;
      }
    }
    else if (playerID == "player1")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay4[1]+20,450);
      // Update total
      context.clearRect(tempPlay4[1]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay4[1]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay4[1]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay4[1],460,85,120);
        tempPlay4[1] += 20;
      }
    }
    else if (playerID == "player2")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay4[2]+20,450);
      // Update total
      context.clearRect(tempPlay4[2]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay4[2]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay4[2]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay4[2],460,85,120);
        tempPlay4[2] += 20;
      }
    }
    else if (playerID == "player3")
    {
      context.fillStyle = "white";
      context.font = "20px Trebuchet MS";
      context.fillText(userName,tempPlay4[3]+20,450);
      // Update total
      context.clearRect(tempPlay4[3]+195, 430, 35, 25);
      context.fillStyle = "#014C12";
      context.fillRect(tempPlay4[3]+195, 430, 35, 25);
      context.fillStyle = "white";
      context.fillText(total,tempPlay4[3]+200,450);
      for (var i in hand)
      {
        context.drawImage(hand[i].image,tempPlay4[3],460,85,120);
        tempPlay4[3] += 20;
      }
    }
  }
}

function ShowDealer(hand)
{
  // Get canvas to draw on
  var canvas = $("#MainCanvas");
  var context = canvas[0].getContext("2d");

  // Print dealer hand
  var tempDealer = dealer.slice();

  // If its the dealers turn, reveal the hand
  if (dealerTurn == true)
  {
    for (var i in hand)
    {
      context.drawImage(hand[i].image,tempDealer[0],40,85,120);
      tempDealer[0] += 20;
    }
  }
  else // Show the first card and a card back
  {
    context.drawImage(hand[0].image,tempDealer[0],40,85,120);
    tempDealer[0] += 20;

    var cardBack = document.createElement('img');
    cardBack.src = "CardImages/card_back.png";
    setTimeout(function()
    {
      context.drawImage(cardBack,tempDealer[0],40,85,120);
    },100);
  }
}

function GetImage(name)
{
  var img = document.createElement('img');
  img.src = "CardImages/Deck/" + name + ".png";
  return img;
}

function StartGame()
{
  $("#buttonStart").hide();
  ResetCanvas();
  dealerTurn = false;
  socket.emit('new_round');
  socket.emit('pass_turn');
}

function Hit()
{
  socket.emit('hit');
}

function Stand()
{
  socket.emit('pass_turn');
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
