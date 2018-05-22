namespace Cornhole {
    export interface ICurrentGameDetailCellProps {
        isPlayer1?: boolean;
        trend?: Trend;
        text?: string;
        value?: KnockoutObservable<number>;
        valueUpdater?: (v: number) => void;
    }

    export class CurrentGameDetailCell {
        public isPlayer1 = false;
        public trend = Trend.None;
        public text = "";
        public value: KnockoutComputed<string>|undefined;

        public constructor(props: ICurrentGameDetailCellProps) {
            if (props.hasOwnProperty("isPlayer1") &&
                props.isPlayer1 !== void (0)) {
                this.isPlayer1 = props.isPlayer1;
            }

            if (props.hasOwnProperty("trend") &&
                props.trend !== void (0)) {
                this.trend = props.trend;
            }

            if (props.hasOwnProperty("text") &&
                props.text !== void (0)) {
                this.text = props.text;
            }

            // Computeds:
            if (typeof props.valueUpdater === "function" &&
                typeof props.value === "number") {
                this.value = ko.pureComputed({
                    read() {
                        return props.value!().toString();
                    },
                    write(value: string) {
                        const valueAsNumber = parseFloat(value);

                        if (_.isFinite(valueAsNumber)) {
                            props.valueUpdater!(valueAsNumber);
                        }
                    }
                })
            }
        }
    }
}