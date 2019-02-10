var gamerule = (function() {

  var createCardSlot = function(deck, parent_selector, slot_id, slot_index) {
    var card_slot = gamerenderer.insertCardSlot(deck.data, parent_selector, slot_id, slot_index);
    var card = gameengine.drawCard(deck);
    deck.opencards.push(card);
    gamerenderer.renderCard(card, slot_id);
  }

  var newGame = function() {
    var defered = gameengine.newGame();
    defered.done(function(data) {
      //The boards are loaded

      //build decks & rendering
      $g.decks = [];
      var buildings = gameengine.registerDeck($g.decks, gamedata.cards.buildings, true, false);
      gamerenderer.insertDeck(buildings);
      buildings.opencards = [];
      createCardSlot(buildings, "#deck-buildings", "buildings_cs_01", 1);
      createCardSlot(buildings, "#deck-buildings", "buildings_cs_02", 2);
       createCardSlot(buildings, "#deck-buildings", "buildings_cs_03", 3);
       createCardSlot(buildings, "#deck-buildings", "buildings_cs_04", 4);
       createCardSlot(buildings, "#deck-buildings", "buildings_cs_05", 5);

      var gods = gameengine.registerDeck($g.decks, gamedata.cards.gods, true, true);
      gamerenderer.insertDeck(gods);

      //init players
      for (var i = 0; i < $g.session.players.length; i++) {
        var player = $g.session.players[i];

        //create game specific variables
        player.hands = {};

        //init hand
        var buildingsHand = gameengine.registerHand(player.hands, buildings.data, 3);
        var godsHand = gameengine.registerHand(player.hands, gods.data, 1);

        var card = gameengine.drawCard(buildings);
        buildingsHand.draw(card);

        //render
        if (player.board_id != null) {
          var slots = gamerenderer.insertHand(buildings.data, "p"+player.index, player.board_id + " .hand-buildings");
          gamerenderer.renderHand(player, player.hands.buildings);

          slots = gamerenderer.insertHand(gods.data, "p"+player.index, player.board_id + " .hand-gods");
          gamerenderer.renderHand(player, player.hands.gods);
        }

        //rerender decks in which cards have been drawn
        gamerenderer.renderDeck(buildings);
        gamerenderer.renderDeck(gods);
      }


    });
    return defered;
  };

  //render specific
  var r_card_building = function(card, slot_id) {
    gamerenderer.renderItem(card, "#" + slot_id + " .card-title");
    gamerenderer.renderItem(card, "#" + slot_id + " .points");
    gamerenderer.renderItem(card, "#" + slot_id + " .effect");
    gamerenderer.renderAttribute(card, "#" + slot_id + " .b-discard", "onclick");

    $("#" + slot_id + " .price").html(renderPrice(card.price));

  }

  var r_card_god = function(card, slot_id) {
    gamerenderer.renderItem(card, "#" + slot_id + " .card-title");
    gamerenderer.renderItem(card, "#" + slot_id + " .card-text");

  }


  var renderPrice = function(price) {
    var html = "";
    var chars = price.split("");
    for (var i = 0; i < chars.length; i++) {
      switch (chars[i]) {
        case "F":
          html += "<span class='ressource badge food'> </span>";
          break;
        case "I":
          html += "<span class='ressource badge iron'> </span>";
          break;
        case "L":
          html += "<span class='ressource badge luxury'> </span>";
          break;
        case "M":
          html += "<span class='ressource badge marble'> </span>";
          break;
        case "S":
          html += "<span class='ressource badge sesterce'> </span>";
          break;
        case "W":
          html += "<span class='ressource badge wood'> </span>";
          break;
        case "?":
          html += "<span class='ressource badge barrel'> </span>";
          break;
      }
    }
    return html;
  }


  //commands
  var c_construct_building = function(scope) {
    console.log(scope);
    var current_player = scope[0];
    var card_uid = scope[1];
  };
  var c_discard_building = function(scope) {
    console.log(scope);
    var current_player = scope[0];
    var card_uid = scope[1];
  };
  var c_construct_temple = function(scope) {
    console.log(scope);
    var current_player = scope[0];
    alert("ola");
  };

  return {
    "newGame": newGame,

    //render
    "r_card_building": r_card_building,
    "r_card_god": r_card_god,

    //commands
    "c_construct_building": c_construct_building,
    "c_discard_building": c_discard_building,
    "c_construct_temple": c_construct_temple
  };
})();
