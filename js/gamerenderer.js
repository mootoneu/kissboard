var gamerenderer = (function() {

  /*--- PRIVATE FUNCTIONS */
  /*------------ Rendering global */
  var renderCache = {};
  var doRenderList = function(list, rdr) {
    var result = rdr.prefix

    for (var i = 0; i < list.length; i++) {
      result += doRenderItem(list[i], rdr.content);
    }
    result += rdr.suffix;
    return result;
  }

  var doRenderItem = function(item, rdr) {
    var result = "";
    try {
      for (var i = 0; i < rdr.length; i++) {
        var action = rdr[i];
        if (typeof(action) != "string") {
          if (action.type == "$") {
            if (item.hasOwnProperty(action.value)) {
              result += item[action.value];
            } else {
              result += action.value;
            }
          } else if (action.type == "%") {
            if (item.hasOwnProperty(action.value)) {
              result += "<span class=\"rdr-item\" data-field=\"" + action.value + "\">" + item[action.value] + "</span>";
            } else {
              result += "<span class=\"rdr-item rdr-item-error\" data-field=\"" + action.value + "\"></span>";
            }
          } else if (action.type == "£") {
            if (item.hasOwnProperty(action.value)) {
              result += item[action.value].call();
            } else {
              result += action.value;
            }
          } else if (action.type == "@") {
            var accessors = action.value.split(".");
            var res = item;
            for (var j = 0; j < accessors.length; j++) {
              var acc = accessors[j];
              if (acc.endsWith("()")) {
                res = res[acc.substring(0, acc.length - 2)].call();
              } else {
                res = res[acc];
              }
            }
            result += res;
          } else if (action.type == "#") {
            result += item;
          }
        } else {
          result += rdr[i];
        }
      }
    } catch (err) {
      result = rdr.join("");
    }
    return result;
  }

  var parseRenderList = function(html) {
    var rdr = {
      "prefix": "",
      "suffix": "",
      "content": null
    }
    try {
      var expressions = html.split('');
      var atindex = -1;
      var endbraceindex = -1;
      var bracesCount = 1;

      for (var i = 0; i < expressions.length; i++) {
        var c = expressions[i];
        switch (c) {
          case "@":
            if (atindex === -1 && expressions[i + 1] === '{') atindex = i++;
            break;
          case "{":
            if (atindex === -1) break;
            bracesCount++; //found inner brace
            break;
          case "}":
            if (atindex === -1) break;
            bracesCount--;
            if (bracesCount == 0) { //found last braces of @{...}
              endbraceindex = i;
            }
            break;
        }
      }

      if (atindex > 0) {
        rdr.prefix = html.substring(0, atindex);
      } else {
        atindex = 0;
      }
      if (endbraceindex != -1 && endbraceindex < html.length) {
        rdr.suffix = html.substring(endbraceindex + 1);
      } else {
        endbraceindex = html.length
      }
      rdr.content = parseRenderItem(html.substring(atindex + 2, endbraceindex))

    } catch (err) {
      rdr.prefix = html;
    }
    return rdr;
  }

  var parseRenderItem = function(html) {
    var rdr = [""];
    var expressions = html.split(/\${|%{|£{|@{|#{/);
    var blockstarted = false;
    var block_index = 0
    var html_index = 0;
    try {
      for (var i = 0; i < expressions.length; i++) {
        var block = expressions[i];
        if (blockstarted) { //then next block starts with a ${
          var firstclosedbrace = block.indexOf('}');
          if (firstclosedbrace == -1) throw "no } found near index " + html_index;
          rdr[++block_index] = {
            "type": html[html_index],
            "value": block.substring(0, firstclosedbrace)
          };
          if (firstclosedbrace + 1 < block.length) {
            rdr[++block_index] = block.substring(firstclosedbrace + 1);
          } else {
            rdr[++block_index] = "";
          }
          html_index += 2 + block.length;
        } else {
          rdr[block_index] += block;
          blockstarted = true;
          html_index += block.length
        }
      }
    } catch (err) {
      rdr = [html];
    }
    return rdr;
  }

  /*--- PUBLIC FUNCTIONS */
  /*------------ Rendering global */
  var renderList = function(list, selector) {
    if (renderCache[selector] === undefined) {
      var html = $(selector).html().trim();
      var rdr = parseRenderList(html);
      renderCache[selector] = {
        "rdr": rdr,
        "html": html
      };
    }
    $(selector).html(doRenderList(list, renderCache[selector].rdr));
  }
  var renderItem = function(item, selector) {
    if (renderCache[selector] === undefined) {
      var html = $(selector).html().trim();
      var rdr = parseRenderItem(html);
      renderCache[selector] = {
        "rdr": rdr,
        "html": html
      };
    }
    $(selector).html(doRenderItem(item, renderCache[selector].rdr));
  }

  var insertTemplate = function(template_name, parent_selector, new_id) {
    var elm = $(gamedata.templates[template_name]).clone();
    $(parent_selector).append(elm);
    if (new_id != null) elm.attr("id", new_id);
    return elm;
  }

  var insertDeck = function(deck) {
    deck.uid = "deck-" + deck.deck.id;
    insertTemplate(deck.deck.template, deck.deck.parent, deck.uid);
    insertTemplate(deck.data.template, "#" + deck.uid + " .deck .top-card");
    insertTemplate(deck.data.template, "#" + deck.uid + " .deck-discard .top-card");

    renderDeck(deck);
  }

  var renderDeck = function(deck) {
    renderItem(deck, "#" + deck.uid + " .deck .card-count")
    if (deck.cards.length == 0) {
      $("#" + deck.uid + " .deck").addClass("empty");
    } else {
      $("#" + deck.uid + " .deck").removeClass("empty");
    }
    if (deck.deck.hasDiscardPile) {
      renderItem(deck, "#" + deck.uid + " .deck-discard .card-count")
      if (deck.discard.length == 0) {
        $("#" + deck.uid + " .deck-discard").addClass("empty");
      } else {
        $("#" + deck.uid + " .deck-discard").removeClass("empty");
      }
    }
  }

  var insertCardSlot = function(card_data, parent_selector, slot_id, slot_index) {
    var elm = insertTemplate(card_data.template, parent_selector, slot_id);
    elm.data("slot_index", slot_index);
    return elm;
  }

  var renderCard = function(card, slot_id) {
    gamerule[card.deck.data.renderer].call(gamerule, card, slot_id);
  }

  var insertHand = function(card_data, owner_id, parent_selector) {
    var handElm = $(parent_selector);
    var slotsCount = handElm.data("slots");
    var slots = [];
    for (var i = 0; i < slotsCount; i++) {
      var slot = insertCardSlot(card_data, parent_selector, owner_id + "-hand-slot-" + card_data.id + "-" + i, i);
      slot.addClass("hand-slot");
      slot.attr("data-slot-id", i);
      slots.push(slot);
    }
    return slots;
  }

  var renderHand = function(player, hand) {
    var slots = $(player.board_id+" .hand-" + hand.id + " .hand-slot");
    for (var i = 0; i < slots.length; i++) {
      var slot = $("#"+slots[i].id);
      if (i < hand.cards.length) {
        slot.removeClass('empty');
        renderCard(hand.cards[i], slot.attr("id"));
      } else {
        slot.addClass('empty');
      }
    }
  }

  /*------------ a-gameselection */
  var renderGameList = function() {
    renderList(gamelist, "#a-gameselection-choosenGame");
  }

  /*--- PUBLIC OBJECT */
  return {
    "renderList": renderList,
    "renderItem": renderItem,
    "insertTemplate": insertTemplate,
    "insertDeck": insertDeck,
    "renderDeck": renderDeck,
    "insertCardSlot": insertCardSlot,
    "renderCard": renderCard,
    "insertHand": insertHand,
    "renderHand": renderHand,
    "renderGameList": renderGameList
  };
})();
