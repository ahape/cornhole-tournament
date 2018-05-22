namespace Cornhole {
    export interface ICurrentGameDescProps {
        gameType: GameType;
    }

    export class CurrentGameDesc {
        public gameTypeString: string;

        public constructor(props: ICurrentGameDescProps) {
            // Computeds:
            this.gameTypeString = (() => {
                switch (props.gameType) {
                    case GameType.BracketChampionship:
                        return "Bracket Championship";
                    case GameType.Championship:
                        return "Championship";
                    case GameType.LosersBracket:
                        return "Losers Bracket";
                    case GameType.WinnersBracket:
                        return "Winners Bracket";
                    default:
                        return "N/A";
                }
            })();
        }
    }
}