namespace Cornhole {
    export interface ICurrentGameTitleProps {
        currentGameNumber: KnockoutComputed<number>;
        totalGames: number;
    }

    export class CurrentGameTitle implements ICurrentGameTitleProps {
        public currentGameNumber: KnockoutComputed<number>;
        public totalGames: number;

        public constructor(props: ICurrentGameTitleProps) {
            this.totalGames = props.totalGames;

            // Computeds:
            this.currentGameNumber = props.currentGameNumber;
        }
    }
}