var gamedata = (function() {
  return {
    "gameid": "romani",
    "gamename": "Romani Ite Domum",
    "players_min": 2,
    "players_max": 4,

    "commands": {
      "construct_building": {
        "id": "construct_building",
        "scope": ["current_player"]
      },
      "construct_temple": {
        "id": "construct_temple",
        "scope": ["current_player"]
      }
    },

    "cards": {
      "buildings": {
        "type": "deck",
        "id": "buildings",
        "template": "card-building",
        "renderer": "r_card_building",
        "cards": [{
            "id": "trading-center",
            "title": "Marché",
            "price": "WWS",
            "effect": "<span class='ressource-container badge badge-pill any'> </span> : <span class='ressource badge barrel'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "marble-works",
            "title": "Marbrerie",
            "price": "WWS",
            "effect": "+<span class='ressource badge marble'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "forum",
            "title": "Forum",
            "price": "WWS",
            "effect": "+<span class='ressource badge sesterce'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "dispensary",
            "title": "Dispensaire",
            "price": "WWS",
            "effect": "Immunisé aux <span class='effect plague'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "aqueduct",
            "title": "Aqueduc",
            "price": "WWS",
            "effect": "Immunisé aux <span class='effect drought'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "baths",
            "title": "Thermes",
            "price": "WWS",
            "effect": "Immunisé aux <span class='effect winter'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "province-wall",
            "title": "Mur provincial",
            "price": "WWIISS",
            "effect": "-<span class='ressource badge threat'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "arena",
            "title": "Arène",
            "price": "LLSS",
            "effect": "<span class='ressource-container badge badge-pill luxury'> </span> : <span class='ressource badge happy'> </span>",
            "copies": 4,
            "points": 1
          },
          {
            "id": "triumph",
            "title": "Arc du Triomphe",
            "price": "IIMMSS",
            "effect": "",
            "copies": 4,
            "points": 3
          },
          {
            "id": "colloseum",
            "title": "Collisé",
            "price": "WWFFSS",
            "effect": "<span class='ressource-container badge badge-pill food'> </span> : <span class='ressource badge happy'> </span>",
            "copies": 2,
            "points": 3
          },
          {
            "id": "hippodrome",
            "title": "Hippodrome",
            "price": "MMFFLLSS",
            "effect": "<span class='ressource-container badge badge-pill food'> </span> : <span class='ressource badge happy'> </span>",
            "copies": 2,
            "points": 5
          },
          {
            "id": "oracle",
            "title": "Oracle",
            "price": "MMMSSS",
            "effect": "Divination",
            "copies": 2,
            "points": 5
          },
          {
            "id": "pantheon",
            "title": "Panthéon",
            "price": "MMMMSSSS",
            "effect": "",
            "copies": 1,
            "points": 8
          }
        ]
      },
      "gods": {
        "type": "deck",
        "id": "gods",
        "template": "card-god",
        "renderer": "r_card_god",
        "cards": [{
            "id": "vulcan",
            "title": "Vulcain",
            "effect": "2x<span class='ressource badge iron'> </span>"
          },
          {
            "id": "diana",
            "title": "Diane",
            "effect": "2x<span class='ressource badge wood'> </span>"
          },
          {
            "id": "juno",
            "title": "Junon",
            "effect": "2x<span class='ressource badge marble'> </span>"
          },
          {
            "id": "ceres",
            "title": "Cérès",
            "effect": "2x<span class='ressource badge food'> </span>"
          },
          {
            "id": "baccus",
            "title": "Baccus",
            "effect": "2x<span class='ressource badge luxury'> </span>"
          },
          {
            "id": "mercury",
            "title": "Mercure",
            "effect": "2x<span class='ressource badge sesterce'> </span>"
          },
          {
            "id": "neptune",
            "title": "Neptune",
            "effect": "+<span class='ressource badge barrel'> </span>"
          },
          {
            "id": "venus",
            "title": "Venus",
            "effect": "+<span class='ressource badge happy'> </span>"
          },
          {
            "id": "appolo",
            "title": "Appolon",
            "effect": "+<span class='ressource badge happy'> </span>/théatre et amphithéatre"
          },
          {
            "id": "vesta",
            "title": "Vesta",
            "effect": "-<span class='ressource badge food'> </span> pour l'entretient des Cité et Villa"
          },
          {
            "id": "jupiter",
            "title": "Jupiter",
            "effect": "+<span class='ressource badge points-3'> </span> pour Cité"
          },
          {
            "id": "minerva",
            "title": "Minerve",
            "effect": "+<span class='ressource badge point'> </span> par Bibliothèque/Académie"
          },
          {
            "id": "pluto",
            "title": "Pluton",
            "effect": "Aucun malus de ressource en cas de <span class='ressource badge unhappy'> </span>"
          },
          {
            "id": "mars",
            "title": "Mars",
            "effect": "-<span class='ressource badge threat'> </span>"
          }
        ]
      }
    },

    "decks": {
      "buildings": {
        "id": "buildings",
        "template": "deck-buildings",
        "parent": "#mainboard",
        "hasDiscardPile": false
      },
      "gods": {
        "id": "gods",
        "template": "deck-gods",
        "parent": "#mainboard",
        "hasDiscardPile": true
      }
    },

    "templates": {
      "sources": [
        "mainboard",
        "playerboard",
        "card-god",
        "deck-gods",
        "card-building",
        "deck-buildings"
      ]
    }
  }
})();
