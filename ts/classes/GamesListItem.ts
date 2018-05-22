namespace Cornhole {
    export interface IGamesListItemProps extends IGamesListItemScoreProps {
        isCurrentGame: KnockoutComputed<boolean>;
        players: IGamesListItemPlayerProps[];
    }

    export class GamesListItem {
        public player1: GamesListItemPlayer;
        public player2: GamesListItemPlayer;
        public isCurrentGame: KnockoutComputed<boolean>;

        public constructor(props: IGamesListItemProps) {
            this.player1 = new GamesListItemPlayer(props.players[0]);
            this.player2 = new GamesListItemPlayer(props.players[1]);
            
            // Computeds:
            this.isCurrentGame = props.isCurrentGame;
        }
    }
}