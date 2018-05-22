namespace Cornhole {
    export interface IGamesListProps {
        games: IGamesListItemProps[];
    }

    export class GamesList {
        public items: GamesListItem[];

        public constructor(props: IGamesListProps) {
            this.items = _.map(props.games, (g) => {
                return new GamesListItem(g);
            });
        }
    }
}