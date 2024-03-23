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
const boardDiv = document.getElementById("myBoard");
var stackDOMs: HTMLDivElement[] = [];

function constructDOM() {
    // per ingredient, create a "station" in the left bar from which to drag ingredients
    ingredientDiv.innerHTML = "";
    for (let i in availableIngredients) {
        const div = document.createElement("div");
        div.className = "tooltip";
        div.draggable = true;
        const ingredientSpan = document.createElement("span");
        div.appendChild(ingredientSpan);
        const tooltipDiv = document.createElement("span");
        tooltipDiv.className = "tooltipText";
        const ing = ingredients.get(availableIngredients[i]);
        tooltipDiv.innerHTML = `${ing.name}: ${ing.cost}/${ing.power}<br><br>`;
        if (ing.effectText !== "") {
            tooltipDiv.innerHTML += `${ing.effectText}<br><br>`;
        }
        tooltipDiv.innerHTML += `<i>${ing.flavorText}</i>`;

        div.onclick = selectCard.bind(null, i);
        div.ondragstart = dragCard.bind(null, i);

        div.appendChild(tooltipDiv);
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(ingredientSpan);
    }

    // add an inital empty stack to add bread, starting a sandwich
    boardDiv.innerHTML = "";
    createEmptyStack();

    draw();

    document.getElementById("drawButton").onclick = drawCards;
}

function createEmptyStack() {
    const div = document.createElement("div");
    
    div.ondrop = dropHandler.bind(null, 0);
    div.ondragover = dragOverHandler;

    boardDiv.appendChild(div);
    stackDOMs.push(div);
}

// start dragging card to play
function dragCard(ingId: number, ev: DragEvent) {
    ev.dataTransfer.setData("ingId", ingId.toString());
    ev.dataTransfer.dropEffect = "copy";
}

function dropHandler(stackId: number, event: DragEvent) {
    event.preventDefault();
    const ingId = event.dataTransfer.getData("ingId");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const ingName = availableIngredients[ingId];
    span.innerText = ingredients.get(ingName).name;
    ingredientCounts[ingId]--;
    draw();
    div.appendChild(span);
    stackDOMs[stackId].insertBefore(div, stackDOMs[stackId].firstChild);
}

function dragOverHandler(event: DragEvent) {
    event.preventDefault();
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

// mark card as being selected; show available locations
function selectCard(i: number) {
    const div = ingredientDOMs[i];
    if (div.style.border === "") {
        div.style.border = "1px solid red";
    }
    else {
        div.style.border = "";
    }
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
