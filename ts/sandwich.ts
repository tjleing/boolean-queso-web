import { Ingredient } from "./types";

export class Sandwich {
    ingredients: Ingredient[] = [];
    div: HTMLDivElement;

    constructor(div: HTMLDivElement) {
        this.div = div;
    }

    close() {
        for (const ingredient of this.ingredients) {
            ingredient.effect(this);
        }
    }
}