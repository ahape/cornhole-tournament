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

var gameData = ko.observableArray([
    {
        scores: [1,0],
        winner: "Gabe",
        loser: "Alan",
    },
    {
        scores: [0,3],
        winner: "Rosy",
        loser: "Matt",
    },
    {
        scores: [4,1],
        winner: "Gabe",
        loser: "Andrew",
    },
    {
        scores: [6,0],
        winner: "Alan",
        loser: "Matt",
    },
    {
        scores: [0,3],
        winner: "Alan",
        loser: "Andrew",
    },
    {
        scores: [1, 0],
        winner: "Gabe",
        loser: "Rosy"
    },
    {
        scores: [10,3],
        winner: "Alan",
        loser: "Rosy",
    },
    {
        scores: [7,0],
        winner: "Alan",
        loser: "Gabe",
    },
    {
        scores: [6,3],
        winner: "Alan",
        loser: "Gabe",
    },

    {
        scores: [9,1],
        winner: "Peter",
        loser: "Gabe",
    },
    {
        scores: [3,0],
        winner: "Alan",
        loser: "Andrew",
    },
    {
        scores: [3,4],
        winner: "Peter",
        loser: "Matt",
    },
    {
        scores: [1,3],
        winner: "Alan",
        loser: "Jim",
    },
    {
        scores: [4,3],
        winner: "Andrew",
        loser: "Matt"
    },
    {
        scores: [1,0],
        winner: "Jim",
        loser: "Gabe"
    },
    {
        scores: [6,3],
        winner: "Andrew",
        loser: "Jim"
    },
    {
        scores: [7,0],
        winner: "Peter",
        loser: "Alan",
    },
    {
        scores: [1,0],
        winner: "Alan",
        loser: "Andrew"
    },
    {
        scores: [3,4],
        winner: "Alan",
        loser: "Peter",
    },
    {
        scores: [6,9],
        winner: "Alan",
        loser: "Peter",
    },

    {
        scores: [9,0],
        winner: "Peter",
        loser: "Gabe",
    },
    {
        scores: [1,0],
        winner: "Jim",
        loser: "Matt",
    },
    {
        scores: [1,3],
        winner: "Peter",
        loser: "Andrew",
    },
    {
        scores: [4,0],
        winner: "Jim",
        loser: "Alan",
    },
    {
        scores: [2,0],
        winner: "Andrew",
        loser: "Matt",
    },
    {
        scores: [2,0],
        winner: "Gabe",
        loser: "Alan",
    },
    {
        scores: [6,3],
        winner: "Andrew",
        loser: "Gabe",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Jim",
    },
    {
        scores: [1,0],
        winner: "Andrew",
        loser: "Jim",
    },
    {
        scores: [6,1],
        winner: "Peter",
        loser: "Andrew",
    },

    {
        scores: [4,0],
        winner: "Peter",
        loser: "Andrew",
    },
    {
        scores: [3,0],
        winner: "Rosy",
        loser: "Matt",
    },
    {
        scores: [3,0],
        winner: "Gabe",
        loser: "Jim",
    },
    {
        scores: [1,0],
        winner: "Jim",
        loser: "Matt",
    },
    {
        scores: [4,3],
        winner: "Alan",
        loser: "Peter",
    },
    {
        scores: [3,0],
        winner: "Rosy",
        loser: "Gabe",
    },
    {
        scores: [6,3],
        winner: "Peter",
        loser: "Jim",
    },
    {
        scores: [6,9],
        winner: "Rosy",
        loser: "Andrew",
    },
    {
        scores: [6,3],
        winner: "Peter",
        loser: "Rosy",
    },
    {
        scores: [1,0],
        winner: "Alan",
        loser: "Gabe",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Gabe",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Alan",
    },
    {
        scores: [3,0],
        winner: "Alan",
        loser: "Peter",
    },

    {
        scores: [3,0],
        winner: "Rosy",
        loser: "Andrew",
    },
    {
        scores: [1,0],
        winner: "Gabe",
        loser: "Matt",
    },
    {
        scores: [1,0],
        winner: "Jim",
        loser: "Alan",
    },
    {
        scores: [2,0],
        winner: "Matt",
        loser: "Alan",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Rosy",
    },
    {
        scores: [3,0],
        winner: "Jim",
        loser: "Gabe",
    },
    {
        scores: [3,1],
        winner: "Matt",
        loser: "Rosy",
    },
    {
        scores: [4,3],
        winner: "Gabe",
        loser: "Andrew",
    },
    {
        scores: [4,3],
        winner: "Gabe",
        loser: "Matt",
    },
    {
        scores: [7,3],
        winner: "Peter",
        loser: "Jim",
    },
    {
        scores: [4,3],
        winner: "Gabe",
        loser: "Jim",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Gabe",
    },

    {
        scores: [3,0],
        winner: "Jim",
        loser: "Chris",
    },
    {
        scores: [6,0],
        winner: "Matt",
        loser: "Rosy",
    },
    {
        scores: [3,0],
        winner: "Andrew",
        loser: "Austin",
    },
    {
        scores: [4,3],
        winner: "Alan",
        loser: "Gabe",
    },
    {
        scores: [4,0],
        winner: "Peter",
        loser: "Jim",
    },
    {
        scores: [1,0],
        winner: "Gabe",
        loser: "Chris",
    },
    {
        scores: [1,0],
        winner: "Rosy",
        loser: "Jim",
    },
    {
        scores: [3,0],
        winner: "Austin",
        loser: "Gabe",
    },
    {
        scores: [6,0],
        winner: "Alan",
        loser: "Andrew",
    },
    {
        scores: [1,0],
        winner: "Peter",
        loser: "Matt",
    },
    {
        scores: [1,0],
        winner: "Andrew",
        loser: "Rosy",
    },
    {
        scores: [3,0],
        winner: "Matt",
        loser: "Austin",
    },
    {
        scores: [6,0],
        winner: "Matt",
        loser: "Andrew",
    },
    {
        scores: [1,0],
        winner: "Alan",
        loser: "Peter",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Matt",
    },
    {
        scores: [6,3],
        winner: "Alan",
        loser: "Peter",
    },

    {
        scores: [6,3],
        winner: "Alan",
        loser: "Gabe",
    },
    {
        scores: [3,0],
        winner: "Jim",
        loser: "Austin",
    },
    {
        scores: [3,4],
        winner: "Chris",
        loser: "Rosy",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Andrew",
    },
    {
        scores: [2,1],
        winner: "Matt",
        loser: "Alan",
    },
    {
        scores: [3,2],
        winner: "Gabe",
        loser: "Andrew",
    },
    {
        scores: [3,0],
        winner: "Austin",
        loser: "Alan",
    },
    {
        scores: [1,0],
        winner: "Rosy",
        loser: "Gabe",
    },
    {
        scores: [6,3],
        winner: "Peter",
        loser: "Chris",
    },
    {
        scores: [1,0],
        winner: "Matt",
        loser: "Jim",
    },
    {
        scores: [9,0],
        winner: "Austin",
        loser: "Chris",
    },
    {
        scores: [6,0],
        winner: "Rosy",
        loser: "Jim",
    },
    {
        scores: [3,0],
        winner: "Rosy",
        loser: "Austin",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Matt",
    },
    {
        scores: [3,0],
        winner: "Rosy",
        loser: "Matt",
    },
    {
        scores: [3,0],
        winner: "Peter",
        loser: "Rosy",
    },
]);

var GameType = {
    "winnersBracket": "Winners Bracket",
    "losersBracket": "Losers Bracket",
    "bracketChampionship": "Championship",
    "championship": "Grand Final"
};

var OddsType = {
    "underdog": "Underdog",
    "even": "Even",
    "favorite": "Favorite"
};

var ComplimentaryOdds = {
    "Underdog": "Favorite",
    "Favorite": "Underdog",
    "Even": "Even"
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

var showRecordAsText = function (recordArr) {
    return recordArr[0] + " - " + recordArr[1];
};

var showRecordAsWinPct = function (recordArr) {
    return ((recordArr[0] / (recordArr[0] + recordArr[1])) || 0) * 100;
};

var showWinPctAsText = function (winPct) {
    return Math.round(winPct) + "%"
};

var getOrderNumberWithSuffix = function (n) {
    var nstr, onesDigit, tensDigit;
    nstr = Math.floor(n).toString();
    onesDigit = parseInt(nstr.charAt(nstr.length - 1), 10);
    tensDigit = parseInt(nstr.charAt(nstr.length - 2), 10);
    
    if (tensDigit === 1) {
        return nstr + "th";
    }

    switch (onesDigit) {
        case 1:
            return nstr + "st";
        case 2: 
            return nstr + "nd";
        case 3: 
            return nstr + "rd";
        default: 
            return nstr + "th";
    }
};

var Player = function(name, wins, losses) {
    var self;

    self = this;
    self.name = name;
    self.wins = ko.computed(function () {
        return _(gameData()).where({ winner: name }).length;
    });
    self.losses = ko.computed(function () {
        return _(gameData()).where({ loser: name }).length;
    });
    self.last10 = ko.computed(function () {
        var last10, won, lost;
        last10 = _(gameData()).filter(function (g) {
            return g.winner === name || g.loser === name;
        }).slice(-10);
        won = _(last10).where({ winner: name });
        lost = _(last10).difference(won);
        return [won.length, lost.length];
    });
    self.last10WinPct = ko.computed(function () {
        return ((self.last10()[0] / (self.last10()[0] + self.last10()[1])) || 0) * 100;
    });
    self.streak = ko.computed(function () {
        var games, outcome, streak;
        games = _(gameData()).filter(function (g) {
            return g.winner === name || g.loser === name;
        });
        streak = 0;

        if(games.length === 0) {
            return "N/A";
        }

        if (_.last(games).winner === name) {
            outcome = "winner";
        } else {
            outcome = "loser";
        }

        while ((games.pop() || {})[outcome] === name) {
            streak++;
        }

        if (outcome === "winner") {
            return "W" + streak;
        }

        return "L" + streak;
    });
    self.trend = ko.computed(function () {
        var last2;
        last2 = _(gameData()).filter(function (g) {
            return g.winner === name || g.loser === name;
        }).slice(-2);

        if (last2[0] && last2[0].winner === name && 
            last2[1] && last2[1].winner === name) {
            return '<i class="material-icons hot-player-icon">arrow_upward</i>';
        }

        if (last2[0] && last2[0].loser === name && 
            last2[1] && last2[1].loser === name) {
            return '<i class="material-icons cold-player-icon">arrow_downward</i>';
        }

        return "";
    });
    self.isEliminated = ko.observable(false);

    self.img = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + imgPaths.pop() + ".png";

    self.winPct = ko.computed(function () {
        return ((self.wins() / (self.wins() + self.losses())) || 0) * 100;
    });

    self.avgPPG = ko.pureComputed(function () {
        var len;
        return ((_(gameData())
            .chain()
            .filter(function (g) {
                return g.winner === name || g.loser === name;
            })
            .map(function (g) {
                if (g.winner === name) {
                    return _.max(g.scores)
                }
                return _.min(g.scores)
            })
            .tap(function (arr) {
                len = arr.length;
            })
            .reduce(function (p,c) {
                return p + c;
            }, 0)
            .value() / len) || 0)
            .toFixed(1);
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

    self.hasPlayers = ko.computed(function () {
        return self.player1() !== null && self.player2() !== null;
    });

    createPreviewPlayerComputed = function (playerKey) {
        return function () {
            var decidingGame;

            if (self[playerKey]()) {
                return self[playerKey]().name;
            }

            if (self.gameType === GameType.championship) {
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

    self.player1RecordVSOpponent = ko.computed(function () {
        var games, p1Name, p2Name;

        if (self.hasPlayers()) {
            p1Name = self.player1().name;
            p2Name = self.player2().name;

            games = _(gameData()).filter(function (g) {
                return (g.winner === p1Name || g.loser === p1Name) &&
                    (g.winner === p2Name || g.loser === p2Name);
            });

            return [
                _(games).where({ winner: p1Name }).length,
                _(games).where({ loser: p1Name }).length
            ];
        }

        return [0,0];
    });

    self.player1WinPctVSOpponent = ko.computed(function () {
        var recordArr;
        recordArr = self.player1RecordVSOpponent();

        return ((recordArr[0] / (recordArr[0] + recordArr[1])) || 0) * 100;
    });

    self.player2RecordVSOpponent = ko.computed(function () {
        return self.player1RecordVSOpponent().slice().reverse();
    });

    self.player2WinPctVSOpponent = ko.computed(function () {
        var recordArr;
        recordArr = self.player2RecordVSOpponent();

        return ((recordArr[0] / (recordArr[0] + recordArr[1])) || 0) * 100;
    });

    self.player1Odds = ko.computed(function () {
        if (!self.hasPlayers()) {
            return OddsType.even;
        }

        if (self.player1WinPctVSOpponent() === 0 && self.player2WinPctVSOpponent() === 0) {
            if (self.player1().winPct() > self.player2().winPct()) {
                return OddsType.favorite;
            }
    
            if (self.player1().winPct() < self.player2().winPct()) {
                return OddsType.underdog;
            }
        } else {
            if (self.player1WinPctVSOpponent() > self.player2WinPctVSOpponent()) {
                return OddsType.favorite;
            }
    
            if (self.player1WinPctVSOpponent() < self.player2WinPctVSOpponent()) {
                return OddsType.underdog;
            }
        }

        return OddsType.even;
    });

    self.player2Odds = ko.computed(function () {
        return ComplimentaryOdds[self.player1Odds()];
    });

    self.canGoNextGame = ko.computed(function () {
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
    var self, player1Score, player2Score, gameEntry;

    self = this;
    player1Score = parseInt(self.player1Score(), 10);
    player2Score = parseInt(self.player2Score(), 10);

    if (isNaN(player1Score) || isNaN(player2Score)) {
        alert("Invalid score entry");
        return;
    }

    gameEntry = {};
    gameEntry.scores = [player1Score, player2Score];

    if (player1Score > player2Score) {
        gameEntry.winner = self.player1().name;
        gameEntry.loser = self.player2().name;    

        if (self.gameType !== GameType.winnersBracket) {
            self.player2().isEliminated(true);
        }

        if (self.gameType === GameType.bracketChampionship ||
            self.gameType === GameType.championship) {
            app.gameOver();
        } else {
            self.winnerNextGame[self.winnerNextGamePlayerKey](self.player1());

            if (self.loserNextGamePlayerKey) {
                self.loserNextGame[self.loserNextGamePlayerKey](self.player2());
            }
            
            app.goNextGame();
        }
    } else {
        gameEntry.winner = self.player2().name;
        gameEntry.loser = self.player1().name; 

        if (self.gameType === GameType.losersBracket ||
            self.gameType === GameType.championship) {
            self.player1().isEliminated(true);
        }

        if (self.gameType === GameType.championship) {
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

    gameData.push(gameEntry);

    self.isFinished(true);
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
    self.playersByRank = ko.computed(function () {
        return _(self.players).sortBy(function (p) {
            // Need 10 games to qualify.
            return -p.winPct() + -((p.wins.peek() + p.losses.peek()) >= 10 ? 101 : 0);
        });
    });
    self.playersByL10Rank = ko.computed(function () {
        return _(self.playersByRank.peek()).sortBy(function (p) {
            return -p.last10WinPct() + -((p.last10.peek()[0] + p.last10.peek()[1]) === 10 ? 101 : 0);
        });
    });
    self.games = [];

    self.setupGames();

    self.currentGame = ko.computed(function() {
        return self.games[self.currentGameIndex()];
    });
};

App.prototype.showRankAsText = function (player) {
    var self, rank;
    self = this;
    rank = _(self.playersByRank()).indexOf(player) + 1 
    return getOrderNumberWithSuffix(rank);
};

App.prototype.showL10RankAsText = function (player) {
    var self, rank;
    self = this;
    rank = _(self.playersByL10Rank()).indexOf(player) + 1;
    return getOrderNumberWithSuffix(rank);
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
                return gt === "W" ? GameType.winnersBracket :
                    gt === "L" ? GameType.losersBracket :
                    gt === "B" ? GameType.bracketChampionship :
                    GameType.championship;
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

                if (game.gameType === GameType.bracketChampionship) {
                    advancement.winner = {
                        gameIndex: i + 1,
                        playerKey: "player1"
                    };
                    advancement.loser = {
                        gameIndex: i + 1,
                        playerKey: "player2"
                    }
                } else if (game.gameType === GameType.championship) {
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

    gameData.pop();

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



