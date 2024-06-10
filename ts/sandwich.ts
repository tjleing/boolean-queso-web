import { ANIM_TIMEOUT } from "./constants";
import { Animatable, SandwichAnimateEvent, Ingredient, IngredientAddEvent, IngredientEffectEvent, IngredientType } from "./types";
import { deepCopy } from "./util";

export class Sandwich implements Animatable {
    ingredients: Ingredient[] = [];
    spans: HTMLSpanElement[] = [];
    private ingredientDiv: HTMLDivElement;
    private powerSpan: HTMLSpanElement;
    animationDoneCallback: () => void;
    sandwichStartedCallback: () => void;
    private animateEvents: SandwichAnimateEvent[] = [];
    isClosed: boolean;
    score: number;

    constructor(div: HTMLDivElement) {
        const powerDiv = document.createElement("div");
        powerDiv.innerText = "Power: ";
        this.powerSpan = document.createElement("span");
        this.powerSpan.innerText = "0";
        powerDiv.appendChild(this.powerSpan);
        div.appendChild(powerDiv);

        this.ingredientDiv = document.createElement("div");
        this.ingredientDiv.id = "sandwich";
        div.appendChild(this.ingredientDiv);
        
        this.isClosed = false;
        this.score = 0;
    }

    setScore() {
        this.score = 0;
        for (const ingredient of this.ingredients) {
            this.score += ingredient.power;
        }
        this.powerSpan.innerText = this.score.toString();
    }

    close() {
        this.isClosed = true;
        for (const ingredient of this.ingredients) {
            ingredient.effect(this);
        }
    }

    canAddIngredient(ing: Ingredient): boolean {
        if (this.ingredients.length === 0) {
            // we're starting a new sandwich, has to be a bread
            if (ing.type !== IngredientType.BREAD) return false;
        }
        if (this.isClosed) {
            // we already closed the sandwich, can't add another ingredient
            // TODO: this is where the fried egg on top would go
            return false;
        }
        return true;
    }

    showIfValidTarget(ing: Ingredient) {
        if (this.canAddIngredient(ing)) {
            this.ingredientDiv.style.background = "seagreen";
        }
        else {
            this.ingredientDiv.style.background = "tomato";
        }
    }

    clearTargetColors() {
        this.ingredientDiv.style.background = "lightgrey";
    }

    addIngredient(ing: Ingredient): boolean {
        if (!this.canAddIngredient) return false;

        const div = document.createElement("div");
        const span = document.createElement("span");
        span.textContent = ing.name;
        div.appendChild(span);

        // add tooltip to sandwich info too
        div.className = "tooltip";
        const tooltip = document.createElement("span");
        tooltip.className = "tooltipText";
        tooltip.innerHTML = `${ing.name}: ${ing.cost}/${ing.power}<br><br>`;
        if (ing.effectText !== "") {
            tooltip.innerHTML += `${ing.effectText}<br><br>`;
        }
        tooltip.innerHTML += `<i>${ing.flavorText}</i>`;
        div.appendChild(tooltip);

        // this is where we copy the ingredient so effects don't modify the
        // source power I guess
        this.ingredients.unshift(deepCopy(ing));
        this.spans.push(span);
        this.ingredientDiv.insertBefore(div, this.ingredientDiv.firstChild);

        const addEvent = new IngredientAddEvent();
        addEvent.name = ing.name;
        addEvent.span = span;
        this.animateEvents.push(addEvent);

        // condiments have instant effects
        if (ing.type === IngredientType.CONDIMENT) {
            ing.effect(this);
        }

        // sandwich is opened, create a new stack
        if (this.ingredients.length === 1) {
            this.sandwichStartedCallback();
        }
        else {
            // did we close the sandwich with this ingredient?
            if (ing.type === IngredientType.BREAD) {
                this.isClosed = true;
            }
        }

        // recompute the expected score (no effects)
        this.setScore();

        return true;
    }

    prepAnimate() {
        for (const event of this.animateEvents) {
            if (event instanceof IngredientAddEvent) {
                event.span.textContent = "???";
            }
        }
    }

    animate() {
        if(this.animateEvents.length === 0) this.animationDoneCallback();
        else {
            if (this.isClosed) {
                // add all ingredient effects
                for (let i = 0; i<this.ingredients.length; ++i) {
                    const event = new IngredientEffectEvent;
                    event.ing = this.ingredients[i];
                    event.span = this.spans[i];
                    this.animateEvents.push(event);
                }
            }

            setTimeout(this.animateInterval.bind(this, 0), ANIM_TIMEOUT);
        }
    }

    animateInterval(i: number) {
        const event = this.animateEvents[i];

        if (event instanceof IngredientAddEvent) {
            event.span.textContent = event.name;
        }
        else if (event instanceof IngredientEffectEvent) {
            event.span.style.fontWeight = "bold";
            event.ing.effect(this);
            this.setScore();
        }

        if(i >= this.animateEvents.length - 1) {
            this.animateEvents = [];
            this.animationDoneCallback();
        }
        else {
            setTimeout(this.animateInterval.bind(this, i+1), ANIM_TIMEOUT);
        }
    }
}