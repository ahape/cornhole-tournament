/*global ko, _, $*/

// There are 3 things that I don't understand about the algo employed on 
// http://challonge.com/tournaments/bracket_generator:
// 1. Based on the # of players, how many games there will be (and what the 
//  game type is for each game).
// 2. Based on the # of players, how many players get a first round bye.
// 3. Based on the # of players and the game, which game the winners and 
//  losers of that game are sent to. 
// 
// The following helpers assist in these 3 areas.

/**
 * An abbreviated list of game types, indexed by player count.
 * @type {Array.<?string>}
 */
var gameTypeByPlayerCountHelper = [
    null,
    null,
    null,
    null,
    "WWLWLBC", // 4
    "WWWLLWLBC",
    "WWWWLLLWLBC", // 6
    "WWWLWWLLLWLBC",
    "WWWWLLWWLLLWLBC", // 8
    "WWWWWLLLWWLLLWLBC",
    "WWWWWWLLLLWWLLLWLBC", // 10
    "WWWWWWWLLLLLWWLLLWLBC",
    "WWWWWWWWLLLLLLWWLLLWLBC", // 12
    "WWWWWLWWWWLLLLLLWWLLLWLBC",
    "WWWWWWLLWWWWLLLLLLWWLLLWLBC", // 14
    "WWWWWWWLLLWWWWLLLLLLWWLLLWLBC"
];

/**
 * A list of lists that indicate how the starting positions should be 
 * distributed. 
 * @type {Array.<Array>}
 */
var playerStartPositionsByPlayerCountHelper = [
    null,
    null,
    null,
    null,
    [1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1,0,1],
    [1,1,1,1,1,1,0,0,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1]
];

/**
 * A list of lists that contain couplets (or a single item array), indicating
 * the game number and player position a game should send it's players to 
 * after it is over.
 * @type {Array.<Array.<Array>>}
 */
var advancementsByPlayerCountByGameIndexHelper = [
    null,
    null,
    null,
    null,
    [
        // W index 0, L index 1
        ["4:1","3:1"], 
        ["4:2","3:2"], 
        ["5:2"], 
        ["6:1", "5:1"], 
        ["6:2"]
    ],
    [
        ["3:2","4:2"], 
        ["6:1","4:1"], 
        ["6:2","5:1"], 
        ["5:2"], 
        ["7:2"], 
        ["8:1", "7:1"], 
        ["8:2"]
    ],
    [ // 6
        [
            "3:2",
            "6:2"
        ],
        [
            "4:2",
            "5:2"
        ],
        [
            "8:1",
            "5:1"
        ],
        [
            "8:2",
            "6:1"
        ],
        [
            "7:1"
        ],
        [
            "7:2"
        ],
        [
            "9:2"
        ],
        [
            "10:1",
            "9:1"
        ],
        [
            "10:2"
        ]
    ],
    [ // 7
        [
            "5:2",
            "8:2"
        ],
        [
            "6:1",
            "4:1"
        ],
        [
            "6:2",
            "4:2"
        ],
        [
            "7:2"
        ],
        [ // G5
            "10:1", 
            "7:1"
        ],
        [
            "10:2",
            "8:1"
        ],
        [
            "9:1"
        ],
        [
            "9:2"
        ],
        [
            "11:2"
        ],
        [ // G10
            "12:1",
            "11:1"
        ],
        [
            "12:2"
        ]
    ],
    [ // 8
        [
            "7:1",
            "5:1"
        ],
        [
            "7:2",
            "5:2"
        ],
        [
            "8:1",
            "6:1"
        ],
        [
            "8:2",
            "6:2"
        ],
        [ // G5
            "10:2"
        ],
        [
            "9:2"
        ],
        [
            "12:1",
            "9:1"
        ],
        [
            "12:2",
            "10:1"
        ],
        [
            "11:1"
        ],
        [ // G10
            "11:2"
        ],
        [
            "13:2"
        ],
        [
            "14:1",
            "13:1"
        ],
        [
            "14:2"
        ]
    ],
    [ // 9
        [
            "5:2",
            "6:2"
        ],
        [
            "10:1",
            "7:1"
        ],
        [
            "9:1",
            "8:1"
        ],
        [
            "9:2",
            "6:1"
        ],
        [ // G5
            "10:2",
            "7:2"
        ],
        [
            "8:2"
        ],
        [
            "11:2"
        ],
        [
            "12:2"
        ],
        [
            "14:1",
            "11:1"
        ],
        [ // G10
            "14:2",
            "12:1"
        ],
        [
            "13:1"
        ],
        [
            "13:2"
        ],
        [
            "15:2"
        ],
        [
            "16:1",
            "15:1"
        ],
        [ // G15
            "16:2"
        ]
    ],
    [ // 10
        [
            "5:2",
            "8:2"
        ],
        [
            "6:2",
            "7:2"
        ],
        [
            "11:1",
            "7:1"
        ],
        [
            "12:1",
            "8:1"
        ],
        [ // G5
            "11:2",
            "9:1"
        ],
        [
            "12:2",
            "10:1"
        ],
        [
            "9:2"
        ],
        [
            "10:2"
        ],
        [
            "14:2"
        ],
        [ // G10
            "13:2"
        ],
        [
            "16:1",
            "13:1"
        ],
        [
            "16:2",
            "14:1"
        ],
        [
            "15:1"
        ],
        [
            "15:2"
        ],
        [ // G15
            "17:2"
        ],
        [
            "18:1",
            "17:1"
        ],
        [
            "18:2"
        ]
    ],
    [ // 11
        [
            "5:2",
            "10:2"
        ],
        [
            "6:2",
            "8:2"
        ],
        [
            "7:2",
            "9:2"
        ],
        [
            "13:1",
            "8:1"
        ],
        [ // G5
            "13:2",
            "9:1"
        ],
        [
            "14:1",
            "12:1"
        ],
        [
            "14:2",
            "10:1"
        ],
        [
            "11:1"
        ],
        [
            "11:2"
        ],
        [ // G10
            "12:2"
        ],
        [
            "16:2"
        ],
        [
            "15:2"
        ],
        [
            "18:1",
            "15:1"
        ],
        [
            "18:2",
            "16:1"
        ],
        [ // G15
            "17:1"
        ],
        [
            "17:2"
        ],
        [
            "19:2"
        ],
        [
            "20:1",
            "19:1"
        ],
        [
            "20:2"
        ]
    ],
    [ // 12
        [
            "5:2",
            "12:2"
        ],
        [
            "6:2",
            "11:2"
        ],
        [
            "7:2",
            "10:2"
        ],
        [
            "8:2",
            "9:2"
        ],
        [ // G5
            "15:1",
            "9:1"
        ],
        [
            "15:2",
            "10:1"
        ],
        [
            "16:1",
            "11:1"
        ],
        [
            "16:2",
            "12:1"
        ],
        [
            "13:1"
        ],
        [ // G10
            "13:2"
        ],
        [
            "14:1"
        ],
        [
            "14:2"
        ],
        [
            "18:2"
        ],
        [
            "17:2"
        ],
        [ // G15
            "20:1",
            "17:1"
        ],
        [
            "20:2",
            "18:1"
        ],
        [
            "19:1"
        ],
        [
            "19:2"
        ],
        [
            "21:2"
        ],
        [ // G20
            "22:1",
            "21:1"
        ],
        [
            "22:2"
        ]
    ],
    [ // 13
        [
            "7:2",
            "14:2"
        ],
        [
            "8:1",
            "6:1"
        ],
        [
            "8:2",
            "6:2"
        ],
        [
            "9:2",
            "12:2"
        ],
        [ // G5
            "10:2",
            "11:2"
        ],
        [
            "13:2"
        ],
        [
            "17:1",
            "11:1"
        ],
        [
            "17:2",
            "12:1"
        ],
        [
            "18:1",
            "13:1"
        ],
        [ // G10
            "18:2",
            "14:1"
        ],
        [
            "15:1"
        ],
        [
            "15:2"
        ],
        [
            "16:1"
        ],
        [
            "16:2"
        ],
        [ // G15
            "20:2"
        ],
        [
            "19:2"
        ],
        [
            "22:1",
            "19:1"
        ],
        [
            "22:2",
            "20:1"
        ],
        [
            "21:1"
        ],
        [ // G20
            "21:2"
        ],
        [
            "23:2"
        ],
        [
            "24:1",
            "23:1"
        ],
        [
            "24:2"
        ]
    ],
    [ // 14
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ]
    ],
    [ // 15
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [
            "",
            ""
        ],
        [
            ""
        ]
    ]
];

var GameTypes = {
    "winnersBracket": "Winners Bracket",
    "losersBracket": "Losers Bracket",
    "bracketChampionship": "Championship",
    "championship": "Grand Final"
};

var OddsTypes = {
    "underdog": "Underdog",
    "even": "Even",
    "favorite": "Favorite"
};

var _imgPaths = [
    "001", "004", "007", "010", "023",
    "025", "054", "068", "074", "077",
    "102", "107", "129", "132", "143"
];

var imgPaths = _.shuffle(_imgPaths);

var middlePop = function (arr) {
    return arr.splice(Math.floor(arr.length / 2), 1)[0];
};

var Player = function(name, wins, losses) {
    var self;

    self = this;
    self.name = name;
    self.wins = ko.observable(wins);
    self.losses = ko.observable(losses);
    self.isEliminated = ko.observable(false);

    self.img = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + imgPaths.pop() + ".png";

    self.winPct = ko.pureComputed(function () {
        return (self.wins() / (self.wins() + self.losses())) || 0;
    });
};

var Game = function(player1, player2, gameNumber, gameType) {
    var self, createPreviewPlayerComputed;

    self = this;
    self.gameNumber = gameNumber;
    self.gameIndex = gameNumber - 1;
    self.gameType = gameType;
    self.isFinished = ko.observable(false);
    self.player1 = ko.observable(player1);
    self.player2 = ko.observable(player2);
    self.player1Score = ko.observable(0);
    self.player2Score = ko.observable(0);
    self.winnerNextGame = null;
    self.winnerNextGamePlayerKey = "";
    self.loserNextGame = null;
    self.loserNextGamePlayerKey = "";

    self.player1Odds = ko.pureComputed(function () {
        if (self.player1().winPct() > self.player2().winPct()) {
            return OddsTypes.favorite;
        }

        if (self.player1().winPct() < self.player2().winPct()) {
            return OddsTypes.underdog;
        }

        return OddsTypes.even;
    });

    self.player2Odds = ko.pureComputed(function () {
        if (self.player2().winPct() > self.player1().winPct()) {
            return OddsTypes.favorite;
        }

        if (self.player2().winPct() < self.player1().winPct()) {
            return OddsTypes.underdog;
        }

        return OddsTypes.even;
    });

    createPreviewPlayerComputed = function (playerKey) {
        return function () {
            var decidingGame;

            if (self[playerKey]()) {
                return self[playerKey]().name;
            }

            if (self.gameType === GameTypes.championship) {
                return "TBD";
            }

            decidingGame = _(app.games).find(function (game) {
                return (game.winnerNextGame === self && game.winnerNextGamePlayerKey === playerKey) ||
                    (game.loserNextGame === self && game.loserNextGamePlayerKey === playerKey);
            });

            if (decidingGame) {
                if (decidingGame.winnerNextGame === self) {
                    return "(winner of " + decidingGame.gameNumber + ")";
                }

                return "(loser of " + decidingGame.gameNumber + ")";
            } 

            return "TBD"
        };
    }; 

    createPlayerEliminatedComputed = function (playerKey) {
        return function () {
            var player;

            player = self[playerKey]();

            if (player) {
                return player.isEliminated() && _.findLastIndex(app.games, function (g) {
                    return g.player1.peek() === player || g.player2.peek() === player;
                }) === self.gameIndex;
            }

            return false;
        };
    };

    self.previewPlayer1 = ko.pureComputed(createPreviewPlayerComputed("player1"));
    self.previewPlayer2 = ko.pureComputed(createPreviewPlayerComputed("player2"));

    self.player1Eliminated = ko.pureComputed(createPlayerEliminatedComputed("player1"));
    self.player2Eliminated = ko.pureComputed(createPlayerEliminatedComputed("player2"));

    self.canGoNextGame = ko.pureComputed(function () {
        var player1Score, player2Score;

        player1Score = parseInt(self.player1Score(), 10);
        player2Score = parseInt(self.player2Score(), 10);

        return !isNaN(player1Score) && 
            !isNaN(player2Score) && // No non-numbers
            player1Score >= 0 &&
            player2Score >= 0 && // No negatives
            player1Score !== player2Score; // No draws
    });

    self.canGoPreviousGame = self.gameNumber !== 1;
};

Game.prototype.onPreviousGameClick = function() {
    app.goPreviousGame();
};

Game.prototype.onNextGameClick = function() {
    var self, player1Score, player2Score;

    self = this;
    player1Score = parseInt(self.player1Score(), 10);
    player2Score = parseInt(self.player2Score(), 10);

    if (isNaN(player1Score) || isNaN(player2Score)) {
        alert("Invalid score entry");
        return;
    }

    if (player1Score > player2Score) {
        self.player1().wins(self.player1().wins() + 1);
        self.player2().losses(self.player2().losses() + 1);

        if (self.gameType !== GameTypes.winnersBracket) {
            self.player2().isEliminated(true);
        }

        if (self.gameType === GameTypes.bracketChampionship ||
            self.gameType === GameTypes.championship) {
            app.gameOver();
        } else {
            self.winnerNextGame[self.winnerNextGamePlayerKey](self.player1());

            if (self.loserNextGamePlayerKey) {
                self.loserNextGame[self.loserNextGamePlayerKey](self.player2());
            }
            
            app.goNextGame();
        }
    } else {
        self.player1().losses(self.player1().losses() + 1);
        self.player2().wins(self.player2().wins() + 1);

        if (self.gameType === GameTypes.losersBracket ||
            self.gameType === GameTypes.championship) {
            self.player1().isEliminated(true);
        }

        if (self.gameType === GameTypes.championship) {
            app.gameOver();
        } else {
            if (self.winnerNextGamePlayerKey) {
                self.winnerNextGame[self.winnerNextGamePlayerKey](self.player2());
            }

            if (self.loserNextGamePlayerKey) {
                self.loserNextGame[self.loserNextGamePlayerKey](self.player1());
            }

            app.goNextGame();
        }
    }

    self.isFinished(true);

    app.log(
        self.gameNumber, 
        self.player1().name, 
        player1Score, 
        self.player2().name, 
        player2Score);
};


var App = function() {
    var self, paramPlayers;

    // TODO: This is cheap, eventually have a form the user fills out
    // to submit the players and their records.
    paramPlayers = window.location.search
        .replace("?", "")
        .replace("players=", "")
        .split(",");

    self = this;
    self.currentGameIndex = ko.observable(0);
    self.players = _(paramPlayers)
        .chain()
        .map(function (txt) {
            var parsed;
            parsed = txt.split("|");
            return new Player(
                $.trim(decodeURIComponent(parsed[0])), 
                parseInt($.trim(decodeURIComponent(parsed[1])), 10) || 0, 
                parseInt($.trim(decodeURIComponent(parsed[2])), 10) || 0);
        })
        .shuffle()
        .value();
    self.games = [];

    self.setupGames();

    self.currentGame = ko.computed(function() {
        return self.games[self.currentGameIndex()];
    });
};

App.prototype.setupGames = function() {
    var self, playersCopy, playerCount, 
        gameTypeByGameIndex, pspHelperCopy, advancementsByGameIndex;

    self = this;
    playersCopy = self.players.slice();
    playerCount = playersCopy.length;

    switch (playerCount) {
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
            gameTypeByGameIndex = _.map(gameTypeByPlayerCountHelper[playerCount].split(""), function (gt) {
                return gt === "W" ? GameTypes.winnersBracket :
                    gt === "L" ? GameTypes.losersBracket :
                    gt === "B" ? GameTypes.bracketChampionship :
                    GameTypes.championship;
            });

            pspHelperCopy = playerStartPositionsByPlayerCountHelper[playerCount].slice();

            advancementsByGameIndex = _.map(advancementsByPlayerCountByGameIndexHelper[playerCount], function (adv) {
                var winnerSplit, loserSplit, winnerInfo, loserInfo;
                winnerSplit = adv[0].split(":");
                loserSplit = adv[1] && adv[1].split(":");
                winnerInfo = {
                    gameIndex: parseInt(winnerSplit[0], 10) - 1,
                    playerKey: winnerSplit[1] === "1" ? "player1" : "player2"
                };
                loserInfo = loserSplit && {
                    gameIndex: parseInt(loserSplit[0], 10) - 1,
                    playerKey: loserSplit[1] === "1" ? "player1" : "player2"
                };
                return {
                    winner: winnerInfo,
                    loser: loserInfo
                };
            });

            // Create all of the games.
            _.times(gameTypeByGameIndex.length, function(i) {
                self.games.push(new Game(
                    pspHelperCopy.shift() && middlePop(playersCopy) || null,
                    pspHelperCopy.shift() && middlePop(playersCopy) || null,
                    i + 1,
                    gameTypeByGameIndex[i]
                ));
            });

            // Wire up all of the advancements.
            _.forEach(self.games, function (game, i) {
                var advancement, wng, lng;
                advancement = advancementsByGameIndex[i] || {}; 

                if (game.gameType === GameTypes.bracketChampionship) {
                    advancement.winner = {
                        gameIndex: i + 1,
                        playerKey: "player1"
                    };
                    advancement.loser = {
                        gameIndex: i + 1,
                        playerKey: "player2"
                    }
                } else if (game.gameType === GameTypes.championship) {
                    return;
                }

                wng = advancement.winner;
                lng = advancement.loser;
                
                game.winnerNextGame = self.games[wng.gameIndex];
                game.winnerNextGamePlayerKey = wng.playerKey;

                if (lng) {
                    game.loserNextGame = self.games[lng.gameIndex];
                    game.loserNextGamePlayerKey = lng.playerKey;
                }
            });
            break;
        default:
            alert("Invalid amount of players. Can only be 5-13");
            break;
    }
};

App.prototype.log = function (
    gameNumber, 
    player1Name, 
    player1Score, 
    player2Name, 
    player2Score) {
    return window.console.log.apply(null, _.toArray(arguments));
};

//  Go to the next game.
App.prototype.goNextGame = function () {
    var self;

    self = this;

    self.currentGameIndex(Math.min(self.games.length - 1, self.currentGameIndex() + 1));
};

// Go to the previous game and unset the logged win/loss for that game.
App.prototype.goPreviousGame = function () {
    var self, currentGame;

    self = this;

    self.currentGameIndex(Math.max(0, self.currentGameIndex() - 1));
    
    currentGame = self.currentGame();

    if (parseInt(currentGame.player1Score(), 10) > parseInt(currentGame.player2Score(), 10)) {
        currentGame.player1().wins(currentGame.player1().wins() - 1);
        currentGame.player2().losses(currentGame.player2().losses() - 1);
    } else {
        currentGame.player1().losses(currentGame.player1().losses() - 1);
        currentGame.player2().wins(currentGame.player2().wins() - 1);
    }

    if (currentGame.player1().isEliminated()) {
        currentGame.player1().isEliminated(false);
    }

    if (currentGame.player2().isEliminated()) {
        currentGame.player2().isEliminated(false);
    }
};

App.prototype.gameOver = function () {
    alert("Game Over");
};


window.onbeforeunload = function (event) {
    var dialogText = "Are you sure you want to leave this page?";
    event.returnValue = dialogText;
    return dialogText;
};

var app = window.debug = new App();

$(function () {
    ko.applyBindings(app);
});


