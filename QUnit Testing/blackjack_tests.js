var deck = [];
var dealer;

class Card
{
  constructor(name)
  {
    this.name = name.split(".")[0];;
    var split = name.split("_");
    this.value = split[0].toLowerCase();
    if (split[0] == "jack" || split[0] == "queen" || split[0] == "king")
    {
      this.weight = 10;
    }
    else if (split[0] == "ace")
    {
      this.weight = 11;
    }
    else
    {
      this.weight = split[0];
    }
    var suitSplit = split[2].split(".");
    this.suit = suitSplit[0].toLowerCase();
    this.image = null; // Image found client-side
  }
}

class Dealer
{
  constructor()
  {
    this.hand = [];
  }
  Total() // Totals the hand, updates as necessary when it contains aces
  {
    console.log("Total() dealer hand length = " + dealer.hand.length);
    // Initial count
    var count = 0;

    for (var i in this.hand)
    {
      console.log("i = " + i);
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }

    // If player total is bust
    if (count > 21)
    {
      // For each card in hand
      for (var i in this.hand)
      {
        // If the card is an ace
        if (this.hand[i].name.includes("ace"))
        {
          // If the weight of the ace is still 11
          if (this.hand[i].weight == 11)
          {
            this.hand[i].weight = 1;
            break;
          }
        }
      }
    }

    count = 0;
    // Updated count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }
    return count;
  }
}

class Player
{
  constructor(socket, id, name)
  {
    this.socket = socket;
    this.name = name;
    this.id = id;
    this.hand = [];
  }
  Total() // Totals the hand, updates as necessary when it contains aces
  {
    var count = 0;
    // Initial count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }

    // If player total is bust
    if (count > 21)
    {
      // For each card in hand
      for (var i in this.hand)
      {
        // If the card is an ace
        if (this.hand[i].name.includes("ace"))
        {
          // If the weight of the ace is still 11
          if (this.hand[i].weight == 11)
          {
            this.hand[i].weight = 1;
            break;
          }
        }
      }
    }

    count = 0;
    // Updated count
    for (var i in this.hand)
    {
      count = parseInt(count) + parseInt(this.hand[i].weight);
    }
    return count;
  }
}

function DealersTurn(newDealer)
{
  dealer = newDealer;
  var finishedChecks = false;

  while (finishedChecks == false)
  {
    // Hit while less than 17
    if (dealer.Total() < 17)
    {
      console.log("hit");
      DealerHit();
    }
    else if (dealer.Total() == 17)   // If soft 17, hit again
    {
      console.log("thing");
      Soft17();
      break;
    }
    else
    {
      console.log("finishedChecks = true");
      finishedChecks = true;
    }
  }

  if (dealer.Total() > 21)
  {
    console.log("Dealer Busts");
    io.sockets.emit('dealer_bust');
  }
  else
  {
    console.log("Dealer Stands");
    io.sockets.emit('dealer_stand');
  }

  console.log("this is reached");
  io.sockets.emit('turn_over');

  setTimeout(function()
  {
    connections[0].socket.emit('end_game');
  },3000);
  // End of dealers turn.
}

function Soft17()
{
  console.log("Checking SOFT17");
  console.log("dealer hand length = " + dealer.hand.length);
  if (dealer.Total() == 17)
  {
    console.log(" Equals 17");
    for (var i in dealer.hand)
    {
      if (dealer.hand[i].name.includes("ace"))
      {
        console.log("   Includes Ace");
        if (dealer.hand[i].weight == 11)
        {
          console.log("     Ace is 11");
          dealer.hand[i].weight = 1;
          while (dealer.Total() < 17)
          {
            console.log("     Hits dealer");
            dealer.hand.push(GetCard());
            // io.sockets.emit('dealer_turn');
            setTimeout(function()
            {
              Soft17();
            },1000);
          }
        }
      }
    }
  }
}

function DealerHit()
{
  if (dealer.Total() < 17)
  {
    console.log("He hits");
    // Hit
    dealer.hand.push(GetCard());
    
    Soft17();
    // io.sockets.emit('dealer_turn');
    setTimeout(function()
    {
      DealerHit();
    },1000);
  }
}

function GetDeck()
{
  executed = true;
  path = "./CardImages/Deck"
  var fs = require("fs");
  files = fs.readdirSync(path);
  for (var i in files)
  {
    var tempCard = new Card(files[i]);
    deck.push(tempCard);
  }
  Shuffle(deck);
  Shuffle(deck);
  Shuffle(deck);
}

function GetCard()
{
  var card = deck.pop();
  return card;
}
