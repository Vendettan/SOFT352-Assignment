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
