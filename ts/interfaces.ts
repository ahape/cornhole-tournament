
namespace Cornhole {
    /**
     * All the data that is captured for each game.
     */
    export interface IGame {
        scores: [number, number],
        winner: string,
        loser: string
    }

    export enum GameType { WinnersBracket, LosersBracket, BracketChampionship, Championship }

    export enum OddsType { Even, Underdog, Favorite }

    export enum OpposingOddsType { Even, Underdog, Favorite }

    export interface IPlayer {
        name: string;
        wins: KnockoutComputed<number>,
        losses: KnockoutComputed<number>,

    }
}

