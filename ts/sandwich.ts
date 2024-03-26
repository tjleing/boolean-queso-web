import { ANIM_TIMEOUT } from "./constants";
import { Animatable, Ingredient } from "./types";

export class Sandwich implements Animatable {
    ingredients: Ingredient[] = [];
    private div: HTMLDivElement;
    animationDoneCallback: () => void;
    private spansAddedThisTurn: HTMLSpanElement[] = [];
    private namesAddedThisTurn: string[] = [];

    constructor(div: HTMLDivElement) {
        this.div = div;
    }

    close() {
        for (const ingredient of this.ingredients) {
            ingredient.effect(this);
        }
    }

    addIngredient(ing: Ingredient) {
        const div = document.createElement("div");
        const span = document.createElement("span");
        span.textContent = ing.name;
        this.ingredients.unshift(ing);
        div.appendChild(span);
        this.div.insertBefore(div, this.div.firstChild);
        this.spansAddedThisTurn.push(span);
        this.namesAddedThisTurn.push(ing.name);
        console.log(this.spansAddedThisTurn);
        console.log(this.namesAddedThisTurn);
    }

    prepAnimate() {
        for (const span of this.spansAddedThisTurn) {
            span.textContent = "???";
        }
    }

    animate() {
        if(this.namesAddedThisTurn.length === 0) this.animationDoneCallback();
        else {
            setTimeout(this.animateInterval.bind(this, 0), ANIM_TIMEOUT);
        }
    }

    animateInterval(i: number) {
        this.spansAddedThisTurn[i].textContent = this.namesAddedThisTurn[i];
        if(i >= this.namesAddedThisTurn.length - 1) {
            this.spansAddedThisTurn = [];
            this.namesAddedThisTurn = [];
            this.animationDoneCallback();
        }
        else {
            setTimeout(this.animateInterval.bind(this, i+1), ANIM_TIMEOUT);
        }
    }
}