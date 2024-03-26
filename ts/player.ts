export interface Player {
    score: number;
    deckSelectEndCallback: () => void;
    turnEndCallback: () => void;
    animationEndCallback: () => void;
    startDeckSelect: () => void;
    startGame: () => void;
    startTurn: () => void;
    startPlayingAnimations: () => void;
}

// TODO: I think most of the DOM stuff at least goes in here actually
//   in particular handling of the animations should be abstracted, it's
//   the same across the player types

// animations: set texts to ??? and then fade in or smth