import { ActionPoints } from "./actionpoints";
import { MAX_SANDWICH_COUNT } from "./constants";
import { ingredients } from "./ingredients";
import { Player } from "./player";
import { Sandwich } from "./sandwich";

export class ComPlayer extends Player {
    score: number;
    deckSelectEndCallback: () => void;
    turnEndCallback: () => void;
    animationEndCallback: () => void;

    boardDiv: HTMLDivElement;
    scoresDiv: HTMLDivElement;
    private availableIngredients: string[] = [
        "white bread",
        "bacon",
        // "tomato",
        // "ranch"
    ];
    private ingredientCounts: number[] = Array(this.availableIngredients.length).fill(0);
    private actionPoints = new ActionPoints();

    constructor(boardDiv, scoresDiv) {
        super();
        this.boardDiv = boardDiv;
        this.scoresDiv = scoresDiv;
        this.sandwiches = [];
    }

    startDeckSelect() {
        this.deckSelectEndCallback();
    }
    startGame() {
        for (let i = 0; i<this.ingredientCounts.length; ++i) {
            this.ingredientCounts[i] = 0;
        }
        this.constructDOM();
        this.startTurn();
    }
    private constructDOM() {
        this.boardDiv.innerHTML = "";
        this.createEmptyStack();
    }
    private createEmptyStack() {
        // cap sandwich count
        if (this.sandwiches.length >= MAX_SANDWICH_COUNT) return;
        const div = document.createElement("div");
        const sandwich = new Sandwich(div);
        
        this.boardDiv.appendChild(div);
        sandwich.sandwichStartedCallback = this.createEmptyStack.bind(this);
        sandwich.animationDoneCallback = this.sandwichAnimationEndCallback;
        this.sandwiches.push(sandwich);
    }

    startTurn() {
        this.turnEndCallback();
    }

    getAnimationActions(): Sandwich[] {
        // no information leakage!  play cards here so no animations leak info
        // to local player
        this.actionPoints.startTurn();
        this.drawCards();
        this.playCards();

        return super.getAnimationActions();
    }

    // draw 3 random ingredients from the options
    private drawCards() {
        const n = this.availableIngredients.length;
        for (let i = 0; i<3; ++i) {
            const randomIndex = Math.floor(Math.random() * n);
            this.ingredientCounts[randomIndex]++;
        }
    }

    // can this ingredient be played currently?  nothing about which stacks are possible right now
    private canPlay(ingId: number) {
        const ing = ingredients.get(this.availableIngredients[ingId]);
        return (ing.cost <= this.actionPoints.current && this.ingredientCounts[ingId] > 0);
    }

    // pick some random cards to play, this is a very basic AI
    private playCards() {
        const n = this.availableIngredients.length;
        for (let _ = 0; _<3; ++_) {
            const randomIngredientIndex = Math.floor(Math.random() * n);

            const ing = ingredients.get(this.availableIngredients[randomIngredientIndex]);
            if (this.canPlay(randomIngredientIndex)) {
                // now pick a sandwich randomly from the ones that'll accept
                // this ingredient
                const workingSandwiches: number[] = [];
                for (let i = 0; i<this.sandwiches.length; ++i) {
                    if (this.sandwiches[i].canAddIngredient(ing)) {
                        workingSandwiches.push(i);
                    }
                }
                if (workingSandwiches.length === 0) continue;

                const randomSandwichIndex = Math.floor(Math.random() * workingSandwiches.length);
                this.sandwiches[workingSandwiches[randomSandwichIndex]].addIngredient(ing);
            }
        }
    }
}