namespace Cornhole {
    export interface ICurrentGameDetailsProps {

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
        public player1Rank: KnockoutComputed<number>;
        public player2Rank: KnockoutComputed<number>;
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
        public rows: CurrentGameDetailRow[];

        public constructor(props: ICurrentGameDetailsProps) {

        }
    }
}