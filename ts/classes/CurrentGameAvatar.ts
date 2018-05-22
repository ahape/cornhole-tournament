namespace Cornhole {
    export interface ICurrentGameAvatarProps {
        name: string;
        imgUrl: string;
        isPlayer1: boolean;
    }

    export class CurrentGameAvatar {
        public name: string;
        public imgUrl: string;
        public isPlayer1: boolean;

        public constructor(props: ICurrentGameAvatarProps) {
            this.name = props.name;
            this.imgUrl = props.imgUrl;
            this.isPlayer1 = props.isPlayer1;
        }
    }
}