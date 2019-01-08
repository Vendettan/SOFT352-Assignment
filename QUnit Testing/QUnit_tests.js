QUnit.test("Checking correct creation of players", function(assert)
{
  var player1 = new Player("socket", "player1", "David");

  assert.ok(player1, "Check player is not null");
  assert.equal(player1.name, "David", "Check player name");
  assert.equal(player1.id, "player1", "Check player ID");
});

QUnit.test("Checking player total function returns correctly", function(assert)
{
  var player = new Player("socket", "player2", "David");

  assert.ok(player, "Check player is not null");
  assert.equal(player.hand.length, 0, "Check player hand is empty");

  var king = new Card("king_of_spades.png");
  var four = new Card("4_of_diamonds.png");

  player.hand.push(king, four);

  assert.equal(player.hand.length, 2, "Check player hand length is 2");
  assert.equal(player.Total(), 14, "Check player Total() function returns correctly");
});

QUnit.test("Checking player total function returns correctly with an Ace", function(assert)
{
  var player = new Player("socket", "player3", "David");

  assert.ok(player, "Check player is not null");

  var ace = new Card("ace_of_spades.png");
  var four = new Card("4_of_diamonds.png");

  player.hand.push(ace, four);

  assert.equal(player.Total(), 15, "Check player Total() function returns correctly with ace as 11");

  var nine = new Card("9_of_hearts.png");

  player.hand.push(nine);

  assert.equal(player.Total(), 14, "Check player Total() function returns correctly with ace as 1");
});

var dealer = new Dealer();

var king = new Card("king_of_hearts.png");
var four = new Card("4_of_diamonds.png");
dealer.hand.push(king, four);
DealersTurn();

QUnit.test("Testing dealer hits when hand total is under 17", function(assert)
{
  var done = assert.async();
  var dealer = new Dealer();

  assert.ok(dealer, "Check dealer is not null");

  var king = new Card("king_of_hearts.png");
  var four = new Card("4_of_diamonds.png");

  dealer.hand.push(king, four);

  setTimeout(function()
  {
    DealersTurn(dealer);
    assert.ok(dealer.hand.length > 2, "Checking dealer hand has more than 2 cards (i.e. has hit)")
    done();
  },200);
});

QUnit.test("Testing dealer doesn't hit when hand total is over 17", function(assert)
{
  var done = assert.async();
  var dealer = new Dealer();

  assert.ok(dealer, "Check dealer is not null");

  var king = new Card("king_of_clubs.png");
  var queen = new Card("queen_of_diamonds.png");

  dealer.hand.push(king, queen);

  setTimeout(function()
  {
    DealersTurn(dealer);
    assert.ok(dealer.hand.length == 2, "Checking dealer hand has only 2 cards (i.e. has not hit)");
    done();
  },200);
});
