var gameengine = (function() {

  var prefetchAllTemplates = function() {
    var templatesToLoad = [];

    for (var i = 0; i < gamedata.templates.sources.length; i++) {
      var template_name = gamedata.templates.sources[i];
      templatesToLoad.push(gameio.fetchTemplate("games/" + $g.session.gameid + "/template/" + template_name + ".html", template_name));
    }
    var deferedLoading = $.when.apply($, templatesToLoad);
    return deferedLoading;
  }

  var newGame = function() {
    var defered = prefetchAllTemplates();
    defered.done(function() {

      //Create main & player boards depending on the HOST_MODE
      if ($g.session.host_mode != "player") { //HOST MODE
        gamerenderer.insertTemplate("mainboard", "#main", "mainboard");
        if ($g.session.host_mode != "board") { //MODE SHARE or HOTSEAT
          for (var player_id = 0; player_id < $g.session.players.length; player_id++) {
            var player = $g.session.players[player_id];
            var elm = gamerenderer.insertTemplate("playerboard", "#main", "board-" + player.uid);
            elm.data("uid", $g.session.players[player_id].uid);
            elm.data("index", $g.session.players[player_id].index);
            player.board_id = "#board-" + player.uid;
          }
        }
      } else { // PLAYER MODE
        var player = $g.session.players[$g.session.player_id];
        var elm = gamerenderer.insertTemplate("playerboard", "#main", "board-" + player.uid);
        elm.data("uid", $g.session.players[player_id].uid);
        elm.data("index", $g.session.players[player_id].index);
        player.board_id = "#board-" + player.uid;
      }
    });

    $g.decks = [];

    return defered;
  }

  var registerDeck = function(decks, cards_obj, shouldShuffle, hasDiscardPile) {
    /// Create a deck of cards from a card object (any gamedata.cards.*) and
    /// shuffle it if needed
    var deck = [];
    var deckTarget;
    //create the decks
    decks[cards_obj.id] = {
      "deck": gamedata.decks[cards_obj.id],
      "data": cards_obj
    };
    deckTarget = decks[cards_obj.id];
    //copy the cards from the gamedata to the deck
    for (var i = 0; i < cards_obj.cards.length; i++) {
      var card = cards_obj.cards[i];
      var copies = card.hasOwnProperty("copies") ? card.copies : 1;
      for (var c = 1; c <= copies; c++) {
        var copy = helper.clone(card);
        copy.uid = cards_obj.id + "_" + ("" + i).padStart(3, "0") + "_" + ("" + c).padStart(2, "0");
        deck.push(copy);
        copy.deck = deckTarget;
      }
    }
    //shuffle the deck if needed
    if (shouldShuffle) {
      shuffle(deck);
    }
    //save the deck
    deckTarget.cards = deck;

    //add a discard pile if needed
    if (hasDiscardPile) {
      decks[cards_obj.id].discard = [];
    }
    return decks[cards_obj.id];
  }

  var registerHand = function(hands, cards_data, maxSize) {
    var hand = {
      "id": cards_data.id,
      "maxSize": maxSize,
      "cards": [],
      "draw": function (card) {
        if (this.cards.length >= maxSize) throw new Error('hand is full');
        this.cards.push(card);
      },
      "discard": function (card_index) {},
      "count": function () { return this.cards.length; },
      "canDraw": function () { return this.cards.length + 1 < maxSize; }
    };
    hands[hand.id] = hand;
    return hand;
  }

  var shuffle = function(array) {
    /// Knuth shuffle, see https://bost.ocks.org/mike/shuffle/
    var m = array.length,
      t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  var drawCard = function(deck) {
    return deck.cards.pop();
  }
  var discardCard = function(deck, card) {
    deck.discard.push(card)
  }

  return {
    "newGame": newGame,
    "registerDeck": registerDeck,
    "registerHand": registerHand,
    "shuffle": shuffle,
    "drawCard": drawCard,
    "discardCard": discardCard
  }
})();
