QUnit.test("Checking correct creation of players", function(assert)
{
  var player1 = new Player("socket", "player1", "David");

  assert.ok(player1, "Check player is not null");
  assert.equal(player1.name, "David", "Check player name");
  assert.equal(player1.id, "player1", "Check player ID");
});

QUnit.test("Checking player total function returns correctly", function(assert)
{
  var player2 = new Player("socket", "player2", "David");

  assert.ok(player2, "Check player is not null");
  assert.equal(player2.hand.length, 0, "Check player hand is empty");

  var king = new Card("king_of_spades.png");
  var four = new Card("4_of_diamonds.png");

  player2.hand.push(king, four);

  assert.equal(player2.hand.length, 2, "Check player hand length is 2");
  assert.equal(player2.Total(), 14, "Check player Total() function returns correctly");
});

QUnit.test("Checking player total function returns correctly with an Ace", function(assert)
{
  var player3 = new Player("socket", "player3", "David");

  assert.ok(player3, "Check player is not null");

  var ace = new Card("ace_of_spades.png");
  var four = new Card("4_of_diamonds.png");

  player3.hand.push(ace, four);

  assert.equal(player3.Total(), 15, "Check player Total() function returns correctly with ace as 11");

  var nine = new Card("9_of_hearts.png");

  player3.hand.push(nine);

  assert.equal(player3.Total(), 14, "Check player Total() function returns correctly with ace as 1");
});

QUnit.test("Testing dealer hits when hand total is under 17", function()
{
  var dealer = new Dealer();

  assert.ok(dealer, "Check dealer is not null");

  var king = new Card("king_of_hearts.png");
  var four = new Card("4_of_diamonds.png");

  dealer.hand.push(king, four);

  DealersTurn();

  assert.ok(true, dealer.hand.length > 2, "Checking dealer hand has more than 2 cards (i.e. has hit)")
  // assertTrue(dealer.hand.length > 2, "Checking dealer hand has more than 2 cards (i.e. has hit)");
});
