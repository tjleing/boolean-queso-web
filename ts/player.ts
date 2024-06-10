import { MAX_SANDWICH_COUNT } from "./constants";
import { Sandwich } from "./sandwich";
import { Animatable } from "./types";

export class Player {
    score: number = 0;
    deckSelectEndCallback(): void {}
    turnEndCallback(): void {}
    sandwichAnimationEndCallback(): void {}
    startDeckSelect(): void {}
    startGame(): void {}
    startTurn(): void {}

    protected sandwiches: Sandwich[];
    protected boardDiv: HTMLDivElement;
    protected scoreSpan: HTMLSpanElement;
    getAnimationActions(): Sandwich[] {
        const animations = [];
        for(const sandwich of this.sandwiches) {
            animations.push(sandwich);
            sandwich.prepAnimate();
        }
        return animations;
    }

    // concept: any player needs to be able to create an empty stack
    protected createEmptyStack() {
        // cap sandwich count
        if (this.sandwiches.length >= MAX_SANDWICH_COUNT) return;

        const div = document.createElement("div");
        const sandwich = new Sandwich(div);
        
        this.boardDiv.appendChild(div);
        sandwich.sandwichStartedCallback = this.createEmptyStack.bind(this);

        sandwich.animationDoneCallback = ((i: number) => {
            if (sandwich.isClosed) {
                // TODO: animation here (dissolve out div??) -- including time before deleting
                //          b/c right now it just deletes right when last ingredient highlighted
                this.score += sandwich.score;
                this.scoreSpan.innerText = this.score.toString();

                // if we were at cap, deleting this means we need a new slot
                if (this.sandwiches.length === MAX_SANDWICH_COUNT) {
                    this.createEmptyStack();
                }

                this.sandwiches.splice(i);
                div.remove();
            }
            this.sandwichAnimationEndCallback();
        }).bind(this, this.sandwiches.length);
        this.sandwiches.push(sandwich);
        return div;
    }
}
