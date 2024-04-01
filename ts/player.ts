import { Sandwich } from "./sandwich";
import { Animatable } from "./types";

export class Player {
    score: number;
    deckSelectEndCallback(): void {}
    turnEndCallback(): void {}
    sandwichAnimationEndCallback(): void {}
    startDeckSelect(): void {}
    startGame(): void {}
    startTurn(): void {}

    protected sandwiches: Sandwich[];
    getAnimationActions(): Sandwich[] {
        const animations = [];
        for(const sandwich of this.sandwiches) {
            animations.push(sandwich);
            sandwich.prepAnimate();
        }
        return animations;
    }
}
