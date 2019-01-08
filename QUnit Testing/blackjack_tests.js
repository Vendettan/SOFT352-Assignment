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
