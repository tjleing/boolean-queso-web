import { MAX_SANDWICH_COUNT } from "./constants";
import { Sandwich } from "./sandwich";
import { Animatable } from "./types";

export class Player {
    score: number = 0;
    name: string;
    deckSelectEndCallback(): void {}
    turnEndCallback(): void {}
    sandwichAnimationEndCallback(): void {}
    startDeckSelect(): void {}
    startGame(): void {}
    startTurn(): void {}

    protected sandwiches: Map<number, Sandwich>;
    protected sandwichCount = 0;
    protected boardDiv: HTMLDivElement;
    protected scoreSpan: HTMLSpanElement;
    getAnimationActions(): Sandwich[] {
        const animations = [];
        for(const [_, sandwich] of this.sandwiches) {
            animations.push(sandwich);
            sandwich.prepAnimate();
        }
        return animations;
    }

    // concept: any player needs to be able to create an empty stack
    protected createEmptyStack(): HTMLDivElement | null {
        // cap sandwich count
        if (this.sandwiches.size >= MAX_SANDWICH_COUNT) return null;

        const div = document.createElement("div");
        const sandwich = new Sandwich(div, this.sandwichCount);
        
        this.boardDiv.appendChild(div);
        sandwich.sandwichStartedCallback = this.createEmptyStack.bind(this);

        sandwich.animationDoneCallback = ((key: number) => {
            if (sandwich.isClosed) {
                // TODO: animation here (dissolve out div??) -- including time before deleting
                //          b/c right now it just deletes right when last ingredient highlighted
                this.score += sandwich.score;
                this.scoreSpan.innerText = this.score.toString();

                // TODO: don't just delete the sandwich, we need to keep it around for
                //       weird ingredient interactions
                this.sandwiches.delete(key);

                // if we were at cap, deleting this means we need a new slot
                if (this.sandwiches.size === MAX_SANDWICH_COUNT - 1) {
                    this.createEmptyStack();
                }

                div.remove();
            }
            this.sandwichAnimationEndCallback();
        }).bind(this, this.sandwiches.size);
        this.sandwiches.set(this.sandwichCount++, sandwich);
        return div;
    }
}
