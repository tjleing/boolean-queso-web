import {IngredientType, Ingredient, Sandwich} from "./types";

const whiteBread: Ingredient = {
    name: "white bread",
    cost: 1,
    power: 1,
    effect: (sandwich: Sandwich) => {
        sandwich.ingredients.map((ing) => {ing.power++; return ing;})
    },
    type: IngredientType.MEAT,
    effectText: "",
    flavorText: "the plainest option"
}

const bacon: Ingredient = {
    name: "bacon",
    cost: 1,
    power: 1,
    effect: (sandwich: Sandwich) => {
        sandwich.ingredients.map((ing) => {ing.power++; return ing;})
    },
    type: IngredientType.MEAT,
    effectText: "on complete, add one to each ingredient in this sandwich",
    flavorText: "bacon goes on everything"
}

const ingredients = new Map<string, Ingredient>();
ingredients.set("bacon", bacon);
ingredients.set("white bread", whiteBread);

export {ingredients};