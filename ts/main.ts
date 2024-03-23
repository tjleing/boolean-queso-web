import {ingredients} from './ingredients';

var availableIngredients: string[] = [
    "white bread",
    "bacon",
    // "tomato",
    // "ranch"
];
var ingredientCounts: number[] = Array(availableIngredients.length).fill(0);
const ingredientDiv = document.getElementById("ingredients");
var ingredientDOMs: HTMLSpanElement[] = [];

function constructDOM() {
    ingredientDiv.innerHTML = "";
    for (let i in availableIngredients) {
        const div = document.createElement("div");
        div.className = "tooltip";
        const ingredientSpan = document.createElement("span");
        div.appendChild(ingredientSpan);
        const tooltipDiv = document.createElement("span");
        tooltipDiv.className = "tooltipText";
        const ing = ingredients.get(availableIngredients[i]);
        console.log(i);
        console.log(availableIngredients);
        console.log(ing);
        tooltipDiv.innerHTML = `${ing.name}: ${ing.cost}/${ing.power}<br><br>`;
        if (ing.effectText !== "") {
            tooltipDiv.innerHTML += `${ing.effectText}<br><br>`;
        }
        tooltipDiv.innerHTML += `${ing.flavorText}`;
        div.appendChild(tooltipDiv);
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(ingredientSpan);
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
