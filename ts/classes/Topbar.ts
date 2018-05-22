/// <reference path="../types/knockout-3.4.0.d.ts" />
/// <reference path="../types/jquery-3.3.0.d.ts" />
/// <reference path="../types/underscore-1.8.0.d.ts" />

namespace Cornhole {
    export interface ITopbarProps {
        canGoPreviousGame: KnockoutComputed<boolean>;
        canGoNextGame: KnockoutComputed<boolean>;
        goPreviousGame: () => void;
        goNextGame: () => void;
    }

    export class Topbar {
        public topbarNavButtons: [TopbarNavButton, TopbarNavButton];

        public constructor(props: ITopbarProps) {
            this.topbarNavButtons = [
                new TopbarNavButton({
                    text: "Previous",
                    canDoNavigation: props.canGoPreviousGame,
                    doNavigation: props.goPreviousGame
                }),
                new TopbarNavButton({
                    text: "Next",
                    canDoNavigation: props.canGoNextGame,
                    doNavigation: props.goNextGame
                })
            ];
        }
    }
}