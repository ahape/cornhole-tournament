namespace Cornhole {
    export interface ICurrentGameDetailRowProps {
        player1Data: ICurrentGameDetailCellProps;
        player2Data: ICurrentGameDetailCellProps;
        label: string; 
    }

    export class CurrentGameDetailRow {
        public player1Data: ICurrentGameDetailCellProps;
        public player2Data: ICurrentGameDetailCellProps;
        public label: string;

        public constructor(props: ICurrentGameDetailRowProps) {
            this.player1Data = props.player1Data;
            this.player2Data = props.player2Data;
            this.label = props.label;
        }
    }
}