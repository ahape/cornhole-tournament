namespace Cornhole {
    export interface ITopbarNavButtonProps {
        text: string;
        canDoNavigation: KnockoutComputed<boolean>;
        doNavigation: () => void;
    }

    export class TopbarNavButton {
        public text: string;
        public canDoNavigation: KnockoutComputed<boolean>;
        public events: JQuery.PlainObject;

        public constructor(props: ITopbarNavButtonProps) {
            this.events = {};

            // Static props:
            this.text = props.text;

            // Computeds:
            this.canDoNavigation = props.canDoNavigation;

            // Event handlers:
            this.events.onNavigationClick = function ( ) {
                if (props.canDoNavigation()) {
                    props.doNavigation();
                }
            }
        }
    }
}