"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var availableIngredients = [
    "bacon",
    "tomato",
    "ranch"
];
var ingredientCounts = Array(availableIngredients.length).fill(0);
var ingredientDiv = document.getElementById("ingredients");
var ingredientDOMs = [];
function constructDOM() {
    for (var i in availableIngredients) {
        var div = document.createElement("div");
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(div);
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
