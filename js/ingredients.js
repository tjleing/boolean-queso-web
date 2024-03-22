"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredients = void 0;
var bacon = {
    cost: 1,
    power: 1,
    effect: function (sandwich) {
        sandwich.ingredients.map(function (ing) { ing.power++; return ing; });
    },
};
var ingredients = new Map();
exports.ingredients = ingredients;
ingredients.set("bacon", bacon);
