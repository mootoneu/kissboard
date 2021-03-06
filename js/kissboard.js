var kissboard = (function() {

  /*--- PRIVATE FUNCTIONS */

  /*--- PUBLIC FUNCTIONS */

  /*------------ a-gameselection */
  var GameSelection_Init = function() {
    $("#a-gameselection").show();
    gamerenderer.renderList(gamelist, "#a-gameselection-choosenGame");
    gamerenderer.renderList([], "#a-gameselection-playerCount");

    //load last session config from storage
    var session = JSON.parse(localStorage.getItem("$g.session"));
    if (session != null && session != undefined) {
      $("#a-gameselection-choosenGame").val(session.gameid);
      var g = gamelist.filter(function(g) {
        return g.gameid == session.gameid;
      })[0];
      gamerenderer.renderList(helper.range(g.players_min, g.players_max), "#a-gameselection-playerCount");
      $("#a-gameselection-playerCount").val(session.players.length);
      $("#hostOptions-" + session.host_mode).select();
    }

  }

  var GameSelection_ChooseGame = function(select) {
    var g = gamelist[select - 1];

    gamerenderer.renderList(helper.range(g.players_min, g.players_max), "#a-gameselection-playerCount");
  }

  var GameSelection_Host = function() {

    //retrieve session parameters
    $g.session = {};
    $g.session.gameid = $("#a-gameselection-choosenGame").val();
    $g.session.host_mode = $('input[name=hostOptions]:checked').val()
    $g.session.players = [];
    for (var i = 1; i <= $("#a-gameselection-playerCount").val(); i++) {
      var uid = "player-" + ("" + i).padStart(2, 0);
      $g.session.players.push({
        "uid": uid,
        "name": "Unnammed " + uid,
        "index": i - 1,
        "board_id": null //id of the board as displayed in the screen of null if the player is playing remotely
      });
    }
    localStorage.setItem("$g.session", JSON.stringify($g.session));


    //hide selection windows
    $("#a-gameselection").hide();

    //load game css
    gameio.loadCSS("games/" + $g.session.gameid + "/gamestyle.css")

    //load game scripts
    $.when(
      gameio.loadJS("games/" + $g.session.gameid + "/gamedata.js"),
      gameio.loadJS("games/" + $g.session.gameid + "/gamerule.js")
    ).done(function() {
      gamerule.newGame();

    })
  }

  var GameSelection_Join = function() {

  }

  var command = function(command_id, scope) {
    console.debug("Calling command", command_id, scope);
    registerCommand(command_id, scope);
  }
  var registerCommand = function(command_id, scope) {
    doCommand(command_id, scope);
  }
  var doCommand = function(command_id, scope) {
    ///Call a command passing it several parameters
    ///Scope can be a single element or an array containing:
    /// - current_player  =>   $g.current_player
    /// - player-(\d)     =>   $g.players[$1]
    /// - anything else   =>   scope

    var params = [];
    var re;
    if (scope != null) {
      if (scope.constructor !== Array) {
        scope = [scope];
      }
      for (sc of scope) {
        if (sc == "current_player") {
          params.push($g.current_player);
        } else if ((re = sc.match(/player-(\d+)/)) != null) {
          params.push($g.players[parseInt(re[1])]);
        } else {
          params.push(sc);
        }
      }
    }
    try {
      console.debug("Calling command", command_id, scope, params);
      gamerule["c_" + command_id].Call(params);
    } catch (error) {
      gamerenderer.showMessage(message("error", "Command failed", "La commande n'as pas pu être exécuté correctement.", {
        "command_id": command_id,
        "scope": scope,
        "params": params,
        "error": error
      }));
    }
  }

  var message = function (level, title, message, context) {
    this.level = level;
    this.title = title;
    this.message = message;
    this.context = context;
    this.toString = function() {
      return this.title + ": "+ this.message;
    }
    this.log = function() {
      switch (level) {
        case "success": console.info(title, message, context); break;
        case "log": console.log(title, message, context); break;
        case "debug": console.debug(title, message, context); break;
        case "info": console.info(title, message, context); break;
        case "warning": console.warn(title, message, context); break;
        case "exception": console.exception(title, message, context); break;
        case "error": console.error(title, message, context); break;
      }
    }
    this.colorClass = function() {
      switch (level) {
        case "success": return "success";
        case "log": return "success";
        case "debug": return "light";
        case "info": return "info";
        case "warning": return "warning";
        case "exception": return "danger";
        case "error": return "danger";
      }
    }
  }

  /*--- PUBLIC OBJECT */
  return {
    "GameSelection_Init": GameSelection_Init,
    "GameSelection_ChooseGame": GameSelection_ChooseGame,
    "GameSelection_Host": GameSelection_Host,
    "GameSelection_Join": GameSelection_Join,
    "command": command,
    "message": message
  };
})();
