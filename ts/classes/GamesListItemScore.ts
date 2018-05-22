namespace Cornhole {
    export interface IGamesListItemScoreProps {
        player1Score: KnockoutComputed<number>;
        player2Score: KnockoutComputed<number>;
    }

    export class GamesListItemScore {
        public player1Score: KnockoutComputed<number>;
        public player2Score: KnockoutComputed<number>;

        public constructor(props: IGamesListItemScoreProps) {
            this.player1Score = props.player1Score;
            this.player2Score = props.player1Score;
        }
    }
}