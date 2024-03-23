"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ingredients_1 = require("./ingredients");
var availableIngredients = [
    "bacon",
    "tomato",
    "ranch"
];
var ingredientCounts = Array(availableIngredients.length).fill(0);
var ingredientDiv = document.getElementById("ingredients");
var ingredientDOMs = [];
function constructDOM() {
    console.log("???");
    for (var i in availableIngredients) {
        var div = document.createElement("div");
        div.className = "tooltip";
        var ingredientSpan = document.createElement("span");
        div.appendChild(ingredientSpan);
        var tooltipSpan = document.createElement("span");
        tooltipSpan.className = "tooltipText";
        var ing = ingredients_1.ingredients.get(availableIngredients[i]);
        tooltipSpan.innerText = "".concat(ing.name, ": ").concat(ing.cost, "/").concat(ing.power, "\n");
        tooltipSpan.innerText += "".concat(ing.effectText, "\n");
        tooltipSpan.innerText += "".concat(ing.flavorText);
        div.appendChild(tooltipSpan);
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(ingredientSpan);
    }
    draw();
    document.getElementById("drawButton").onclick = drawCards;
}
function draw() {
    for (var i in ingredientDOMs) {
        var ing = availableIngredients[i];
        ingredientDOMs[i].innerText =
            "".concat(ing, ": ").concat(ingredientCounts[i]);
    }
}
function start() {
    for (var i in availableIngredients) {
        ingredientCounts[i] = 0;
    }
    constructDOM();
}
// draw 3 random ingredients from the options
function drawCards() {
    var n = availableIngredients.length;
    for (var i = 0; i < 3; ++i) {
        var randomIndex = Math.floor(Math.random() * n);
        ingredientCounts[randomIndex]++;
    }
    draw();
}
start();
