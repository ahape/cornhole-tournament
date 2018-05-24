namespace Cornhole {
    function toRankString(rank: number) {
        const nstr = Math.floor(rank).toString();
        const onesDigit = parseInt(nstr.charAt(nstr.length - 1), 10);
        const tensDigit = parseInt(nstr.charAt(nstr.length - 2), 10);
        
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
    }

    function makePlayerVOppComputed(
        playerComputedA: KnockoutComputed<string>,
        playerComputedB: KnockoutComputed<string>,
        gamesComputed: KnockoutComputed<IGame[]>) {
        return () => {
            const a = playerComputedA();
            const b = playerComputedB();
            const matchups = _.filter(gamesComputed(), (g) => {
                return (g.winner === a && g.loser === b) ||
                    (g.winner === b && g.loser === a);
            });
            const aWins = _.filter(matchups, (g) => g.winner === a).length;
            return `${aWins} - ${matchups.length - aWins}`;
        }
    }

    function makePlayerStreakComputed(
        playerComputed: KnockoutComputed<string>,
        gamesComputed: KnockoutComputed<IGame[]>) {
        return () => {
            const name = playerComputed();
            const games = _(gamesComputed()).filter(function (g) {
                return g.winner === name || g.loser === name;
            });
            let streak = 0;
            let outcome: "winner" | "loser";
    
            if(games.length === 0) {
                return "N/A";
            }
    
            if (_.last(games)!.winner === name) {
                outcome = "winner";
            } else {
                outcome = "loser";
            }
    
            while ((games.pop() || {} as IGame)[outcome] === name) {
                streak += 1;
            }
    
            if (outcome === "winner") {
                return "W" + streak;
            }
    
            return "L" + streak;            
        };
    }

    function makeL10Computed(
        playerComputed: KnockoutComputed<string>,
        gamesComputed: KnockoutComputed<IGame[]>) {
        return () => {
            const player = playerComputed();
            const last10 = _.filter(gamesComputed(), (g) => {
                return g.winner === player || g.loser === player;
            }).slice(-10);
            const gamesWon = _.filter(last10, (g) => g.winner === player);
            const gamesLost = _.filter(last10, (g) => g.loser === player);

            return `${gamesWon.length}-${gamesLost.length}`;
        }
    }

    function makeAvgPPGComputed(
        playerComputed: KnockoutComputed<string>,
        gamesComputed: KnockoutComputed<IGame[]>) {
        return () => {
            const player = playerComputed();
            const games = _.filter(gamesComputed(), (g) => {
                return g.winner === player || g.loser === player;
            });
            const scores  = _.map(games, (g) => {
                if (g.winner === player) {
                    return _.max(g.score[]);
                }

                return _.min(g.score);
            });
            const total = _.reduce(scores, (p, c) => p + c, 0);
            return total / scores.length;
        };
    }

    function makePlayerTrendComputed(
        playerComputed: KnockoutComputed<string>, 
        gamesComputed: KnockoutComputed<IGame[]>) {

        return () => {
            const player = playerComputed();
            const last2 = _.filter(gamesComputed(), (g) => {
                return g.loser === player || g.winner === player; 
            }).slice(-2);
    
            if (_.all(last2, (g) => g.winner === player)) {
                return Trend.Up;
            }
    
            if (_.all(last2, (g) => g.loser === player)) {
                return Trend.Down;
            }
    
            return Trend.None;
        };
    }

    function makePlayerWinPctComputed(
        winsComputed: KnockoutComputed<number>, 
        gamesComputed: KnockoutComputed<IGame[]>) {
        
        return () => {
            return winsComputed() / gamesComputed().length * 100 + "%";
        };
    }

    function makePlayersByRankComputed(
        gamesComputed: KnockoutComputed<IGame[]>,
        isLast10: boolean = false) {
        return () => {
            const games = gamesComputed();
            const players = _.chain(games)
                .map((g) => {
                    return [g.winner, g.loser];
                })
                .flatten()
                .uniq()
                .value();

            return _.sortBy(players, (p) => {
                const gamesForContext = isLast10 ?
                    _.filter(games, (g) => 
                        g.winner === p || g.loser === p).slice(-10) :
                    games;
                const wins = _.filter(gamesForContext, (g) => 
                    g.winner === p).length;
                const losses = _.filter(gamesForContext, (g) => 
                    g.loser === p).length;

                if (wins + losses <= 10) {
                    return -10000;
                }

                return losses === 0 ? 
                    100 : 
                    wins === 0 ?
                        0 :
                        wins / losses;
            }).reverse();
        };
    }
    
    export interface ICurrentGameDetailsProps {
        player1: KnockoutComputed<string>;
        player2: KnockoutComputed<string>;
        games: KnockoutComputed<IGame[]>;
    }

    export class CurrentGameDetails {
        public player1Name: KnockoutComputed<string>;
        public player2Name: KnockoutComputed<string>;
        public player1Trend: KnockoutComputed<Trend>;
        public player2Trend: KnockoutComputed<Trend>;
        public player1Wins: KnockoutComputed<number>;
        public player2Wins: KnockoutComputed<number>;
        public player1Losses: KnockoutComputed<number>;
        public player2Losses: KnockoutComputed<number>;
        public player1WinPct: KnockoutComputed<string>;
        public player2WinPct: KnockoutComputed<string>;
        public player1Rank: KnockoutComputed<string>;
        public player2Rank: KnockoutComputed<string>;
        public player1AvgPPG: KnockoutComputed<number>;
        public player2AvgPPG: KnockoutComputed<number>;
        public player1Last10: KnockoutComputed<string>;
        public player2Last10: KnockoutComputed<string>;
        public player1Last10Rank: KnockoutComputed<string>;
        public player2Last10Rank: KnockoutComputed<string>;
        public player1Streak: KnockoutComputed<string>;
        public player2Streak: KnockoutComputed<string>;
        public player1VOpp: KnockoutComputed<string>;
        public player2VOpp: KnockoutComputed<string>;
        public player1Score: KnockoutObservable<string>;
        public player2Score: KnockoutObservable<string>;
        public player1ScoreAsNumber: KnockoutComputed<number>;
        public player2ScoreAsNumber: KnockoutComputed<number>;
        public rows: any[];

        public constructor(props: ICurrentGameDetailsProps) {
            const playersByRank = ko.computed(makePlayersByRankComputed(props.games));
            const playersByL10Rank = ko.computed(makePlayersByRankComputed(
                props.games, true));

            this.player1Name = props.player1;
            this.player2Name = props.player2;
            this.player1Trend = ko.computed(makePlayerTrendComputed(
                props.player1, props.games));
            this.player2Trend = ko.computed(makePlayerTrendComputed(
                props.player2, props.games));
            this.player1Wins = ko.computed(() =>
                _.filter(props.games, (g) => 
                    g.winner === props.player1()).length);
            this.player2Wins = ko.computed(() =>
                _.filter(props.games, (g) => 
                    g.winner === props.player2()).length);
            this.player1Losses = ko.computed(() =>
                _.filter(props.games, (g) => 
                    g.loser === props.player1()).length);
            this.player2Losses = ko.computed(() =>
                _.filter(props.games, (g) => 
                    g.loser === props.player2()).length);
            this.player1WinPct = ko.computed(makePlayerWinPctComputed(
                this.player1Wins, props.games));
            this.player2WinPct = ko.computed(makePlayerWinPctComputed(
                this.player2Wins, props.games));
            this.player1Rank = ko.computed(() => 
                toRankString(playersByRank().indexOf(props.player1()) + 1));
            this.player2Rank = ko.computed(() => 
                toRankString(playersByRank().indexOf(props.player2()) + 1));
            this.player1AvgPPG = ko.computed(makeAvgPPGComputed(
                props.player1, props.games));
            this.player2AvgPPG = ko.computed(makeAvgPPGComputed(
                props.player2, props.games));
            this.player1Last10 = ko.computed(() =>
                toRankString(playersByRank().indexOf(props.player1()) + 1));
            this.player2Last10 = ko.computed(() =>
                toRankString(playersByRank().indexOf(props.player1()) + 1));
            this.player1Last10Rank = ko.computed(() => 
                toRankString(playersByL10Rank().indexOf(props.player1()) + 1));
            this.player2Last10Rank = ko.computed(() => 
                toRankString(playersByL10Rank().indexOf(props.player1()) + 1));
            this.player1Streak = ko.computed(makePlayerStreakComputed(
                props.player1, props.games));
            this.player2Streak = ko.computed(makePlayerStreakComputed(
                props.player2, props.games));
            this.player1VOpp = ko.computed(makePlayerVOppComputed(
                props.player1, props.player2, props.games));
            this.player2VOpp = ko.computed(makePlayerVOppComputed(
                props.player2, props.player1, props.games));
            this.player1Score = ko.observable("");
            this.player2Score = ko.observable("");
            this.player1ScoreAsNumber = ko.computed(() => 
                parseInt(this.player1Score(), 10) || 0);
            this.player2ScoreAsNumber = ko.computed(() => 
                parseInt(this.player2Score(), 10) || 0);
            this.rows = [
                [this.player1Name, "VS", this.player2Name],
                [this.player1Wins, "Wins", this.player2Wins],
                [this.player1Losses, "Losses", this.player2Losses],
                [this.player1WinPct, "Win Pct", this.player2WinPct],
                [this.player1Rank, "Rank", this.player2Rank],
                [this.player1AvgPPG, "Avg PPG", this.player2AvgPPG],
                [this.player1Last10, "Last 10", this.player2Last10],
                [this.player1Last10Rank, "L10 Rank", this.player2Last10Rank],
                [this.player1Streak, "Streak", this.player2Streak],
                [this.player1VOpp, "vs Opp", this.player2VOpp],
                [this.player1Score, "Score", this.player2Score]
            ];
        }
    }
}