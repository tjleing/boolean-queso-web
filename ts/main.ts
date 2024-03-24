import { ingredients } from './ingredients';
import { ActionPoints } from './actionpoints';

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
var actionPoints = new ActionPoints();

function constructDOM() {
    // per ingredient, create a "station" in the left bar from which to drag ingredients
    ingredientDiv.innerHTML = "";
    for (let i = 0; i<availableIngredients.length; ++i) {
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

        div.ondragstart = dragCard.bind(null, i);
        div.ondragend = stopDrag;
        div.onmouseover = hoverCard.bind(null, i);
        div.onmouseout = unhoverCard;

        div.appendChild(tooltipDiv);
        ingredientDiv.appendChild(div);
        ingredientDOMs.push(ingredientSpan);
    }

    // add an inital empty stack to add bread, starting a sandwich
    boardDiv.innerHTML = "";
    createEmptyStack();

    render();

    document.getElementById("endTurnButton").onclick = endTurn;
}

function createEmptyStack() {
    const div = document.createElement("div");
    
    div.ondrop = dropHandler.bind(null, 0);
    div.ondragover = dragOverHandler;

    boardDiv.appendChild(div);
    stackDOMs.push(div);
}

// can this ingredient be played currently?  nothing about which stacks are possible right now
function canPlay(ingId: number) {
    const ing = ingredients.get(availableIngredients[ingId]);
    return (ing.cost <= actionPoints.current && ingredientCounts[ingId] > 0);
}

function hoverCard(ingId: number, ev: MouseEvent) {
    const elt = (ev.target as HTMLElement).parentElement;
    if (canPlay(ingId)) {
        elt.classList.add("canPlay");
    }
    else {
        elt.classList.add("cantPlay");
    }
}

function unhoverCard(ev: MouseEvent) {
    const elt = (ev.target as HTMLElement).parentElement;
    elt.classList.remove("canPlay");
    elt.classList.remove("cantPlay");
}

// start dragging card to play
function dragCard(ingId: number, ev: DragEvent) {
    if (!canPlay(ingId)) {
        ev.preventDefault();
        return;
    }
    else {
        const ing = ingredients.get(availableIngredients[ingId]);
        ev.dataTransfer.setData("ingId", ingId.toString());
        ev.dataTransfer.dropEffect = "copy";
        (ev.target as HTMLElement).classList.add("dragging");
        actionPoints.tentativeSpend(ing.cost);
    }
}

function stopDrag(ev: DragEvent) {
    (ev.target as HTMLElement).classList.remove("dragging");
    actionPoints.clearSpend();
}

function dropHandler(stackId: number, event: DragEvent) {
    event.preventDefault();
    const ingId = event.dataTransfer.getData("ingId");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const ingName = availableIngredients[ingId];
    span.innerText = ingredients.get(ingName).name;
    ingredientCounts[ingId]--;
    actionPoints.spend();
    render();
    div.appendChild(span);
    stackDOMs[stackId].insertBefore(div, stackDOMs[stackId].firstChild);
}

function dragOverHandler(event: DragEvent) {
    event.preventDefault();
}

function render() {
    for (let i = 0; i<ingredientDOMs.length; ++i) {
        const ing = availableIngredients[i];
        ingredientDOMs[i].innerText =
            `${ing}: ${ingredientCounts[i]}`;
    }
    actionPoints.render();
}

function start() {
    for (let i = 0; i<ingredientCounts.length; ++i) {
        ingredientCounts[i] = 0;
    }

    constructDOM();
}

// handle end turn logic:
// if online, wait for other player
// then:
// handle faster player's cards played & completed sandwich effects
// handle slower ---
// refill action points
// draw cards
function endTurn() {
    actionPoints.endTurn();
    drawCards();
    render();
}

// draw 3 random ingredients from the options
function drawCards() {
    const n = availableIngredients.length;
    for (let i = 0; i<3; ++i) {
        const randomIndex = Math.floor(Math.random() * n);
        ingredientCounts[randomIndex]++;
    }

    render();
}

start();
