namespace Cornhole {
    export interface IGamesListItemPlayerProps {
        name: string;
        wasEliminated: KnockoutComputed<boolean>;
    }

    export class GamesListItemPlayer {
        public name: string;
        public wasEliminated: KnockoutComputed<boolean>;

        public constructor(props: IGamesListItemPlayerProps) {
            this.name = props.name;
            this.wasEliminated = props.wasEliminated;
        }
    }
}