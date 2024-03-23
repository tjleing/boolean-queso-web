"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredients = void 0;
var whiteBread = {
    name: "white bread",
    cost: 1,
    power: 1,
    effect: function (sandwich) {
        sandwich.ingredients.map(function (ing) { ing.power++; return ing; });
    },
    type: IngredientType.MEAT,
    effectText: "",
    flavorText: "the plainest option"
};
var bacon = {
    name: "bacon",
    cost: 1,
    power: 1,
    effect: function (sandwich) {
        sandwich.ingredients.map(function (ing) { ing.power++; return ing; });
    },
    type: IngredientType.MEAT,
    effectText: "on complete, add one to each ingredient in this sandwich",
    flavorText: "bacon goes on everything"
};
var ingredients = new Map();
exports.ingredients = ingredients;
ingredients.set("bacon", bacon);
ingredients.set("white bread", whiteBread);
