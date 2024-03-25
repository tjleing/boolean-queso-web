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
