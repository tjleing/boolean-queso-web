import { ANIM_TIMEOUT } from "./constants";
import { Animatable, Ingredient, IngredientType } from "./types";

export class Sandwich implements Animatable {
    ingredients: Ingredient[] = [];
    private div: HTMLDivElement;
    animationDoneCallback: () => void;
    sandwichStartedCallback: () => void;
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

    canAddIngredient(ing: Ingredient): boolean {
        if (this.ingredients.length === 0) {
            // we're starting a new sandwich, has to be a bread
            if (ing.type !== IngredientType.BREAD) return false;
        }
        return true;
    }

    showIfValidTarget(ing: Ingredient) {
        if (this.canAddIngredient(ing)) {
            this.div.style.background = "seagreen";
        }
        else {
            this.div.style.background = "tomato";
        }
    }

    clearTargetColors() {
        this.div.style.background = "lightgrey";
    }

    addIngredient(ing: Ingredient): boolean {
        if (!this.canAddIngredient) return false;

        const div = document.createElement("div");
        const span = document.createElement("span");
        span.textContent = ing.name;
        this.ingredients.unshift(ing);
        div.appendChild(span);
        this.div.insertBefore(div, this.div.firstChild);
        this.spansAddedThisTurn.push(span);
        this.namesAddedThisTurn.push(ing.name);

        // condiments have instant effects
        if (ing.type === IngredientType.CONDIMENT) {
            ing.effect(this);
        }

        // sandwich is opened, create a new stack
        if (this.ingredients.length === 1) {
            this.sandwichStartedCallback();
        }

        return true;
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