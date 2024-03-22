import {ingredients} from './ingredients'

var availableIngredients: string[] = [
    "bacon",
    "tomato",
    "ranch"
];
var ingredientCounts: number[] = Array(availableIngredients.length).fill(0);
const ingredientDiv = document.getElementById("ingredients");
var ingredientDOMs: HTMLDivElement[] = [];

function constructDOM() {
    for (let i in availableIngredients) {
        const div = document.createElement("div");
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(div);
    }

    draw();

    document.getElementById("drawButton").onclick = drawCards;
}

function draw() {
    for (let i in ingredientDOMs) {
        const ing = availableIngredients[i];
        ingredientDOMs[i].innerText =
            `${ing}: ${ingredientCounts[i]}`;
    }
}

function start() {
    for (let i in availableIngredients) {
        ingredientCounts[i] = 0;
    }

    constructDOM();
}

// draw 3 random ingredients from the options
function drawCards() {
    const n = availableIngredients.length;
    for (let i = 0; i<3; ++i) {
        const randomIndex = Math.floor(Math.random() * n);
        ingredientCounts[randomIndex]++;
    }

    draw();
}

start();
