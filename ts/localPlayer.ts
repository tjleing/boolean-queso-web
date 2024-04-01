import { ActionPoints } from "./actionpoints";
import { ingredients } from "./ingredients";
import { Player } from "./player";
import { Sandwich } from "./sandwich";
import { Animatable, Ingredient } from "./types";

export class LocalPlayer extends Player {
    score: number;
    deckSelectEndCallback: () => void;
    turnEndCallback: () => void;
    animationEndCallback: () => void;

    private ingredientDiv: HTMLDivElement;
    private boardDiv: HTMLDivElement;
    private availableIngredients: string[] = [
        "white bread",
        "bacon",
        // "tomato",
        // "ranch"
    ];
    private ingredientCounts: number[] = Array(this.availableIngredients.length).fill(0);
    private ingredientDOMs: HTMLSpanElement[] = [];
    private actionPoints = new ActionPoints();
    private endTurnButton = document.getElementById("endTurnButton") as HTMLButtonElement;

    // due to security concerns, the drag/drop API blocks any info on the
    // currently dragged item until it's dropped, so we need to store the info here
    private currentlyDraggedIngredient: Ingredient;

    constructor(ingredientDiv, boardDiv) {
        super();
        this.ingredientDiv = ingredientDiv;
        this.boardDiv = boardDiv;
        this.sandwiches = [];
    }

    startDeckSelect() {
        // TODO: actually select a deck here
        this.deckSelectEndCallback();
    }

    startGame() {
        for (let i = 0; i<this.ingredientCounts.length; ++i) {
            this.ingredientCounts[i] = 0;
        }

        this.constructDOM();
        this.startTurn();
    }

    private constructDOM() {
        // per ingredient, create a "station" in the left bar from which to drag ingredients
        this.ingredientDiv.innerHTML = "";
        for (let i = 0; i<this.availableIngredients.length; ++i) {
            const div = document.createElement("div");
            div.className = "tooltip";
            div.draggable = true;
            const ingredientSpan = document.createElement("span");
            div.appendChild(ingredientSpan);
            const tooltipDiv = document.createElement("span");
            tooltipDiv.className = "tooltipText";
            const ing = ingredients.get(this.availableIngredients[i]);
            tooltipDiv.innerHTML = `${ing.name}: ${ing.cost}/${ing.power}<br><br>`;
            if (ing.effectText !== "") {
                tooltipDiv.innerHTML += `${ing.effectText}<br><br>`;
            }
            tooltipDiv.innerHTML += `<i>${ing.flavorText}</i>`;

            div.ondragstart = this.dragCard.bind(this, i);
            div.ondragend = this.stopDrag.bind(this);
            div.onmouseover = this.hoverCard.bind(this, i);
            div.onmouseout = this.unhoverCard.bind(this);

            div.appendChild(tooltipDiv);
            this.ingredientDiv.appendChild(div);
            this.ingredientDOMs.push(ingredientSpan);
        }

        // add an inital empty stack to add bread, starting a sandwich
        this.boardDiv.innerHTML = "";
        this.createEmptyStack();

        this.render();

        this.endTurnButton.onclick = this.endTurn.bind(this);
    }

    private render() {
        for (let i = 0; i<this.ingredientDOMs.length; ++i) {
            const ing = this.availableIngredients[i];
            this.ingredientDOMs[i].textContent =
                `${ing}: ${this.ingredientCounts[i]}`;
        }
        this.actionPoints.render();
    }

    startTurn() {
        this.endTurnButton.textContent = "End turn";
        this.endTurnButton.disabled = false;

        this.actionPoints.startTurn();
        this.drawCards();
        this.render();
    }

    private endTurn() {
        this.endTurnButton.textContent = "waiting...";
        this.endTurnButton.disabled = true;
        
        this.turnEndCallback();
    }

    // draw 3 random ingredients from the options
    private drawCards() {
        const n = this.availableIngredients.length;
        for (let i = 0; i<3; ++i) {
            const randomIndex = Math.floor(Math.random() * n);
            this.ingredientCounts[randomIndex]++;
        }

        this.render();
    }



    // TODO: need to revisit this, but I'm putting it here to make sure the
    // refactor went through correctly

    // TODO:
    // - move this logic to sandwich class
    // - also critically the drop handler also is really important here
    // - ... well the drop handler is only important to the local player, the AI/remote
    //    players wouldn't need a drop handler.  so maybe we UML the three subtypes
    //    of player and let them figure out the different 

    // TODO:
    // um so does a sandwich own a stack?  maybe that's fine?  an empty sandwich can
    // just have an empty stack I guess.  the important logic is that adding bread
    // to a stack needs to open a new empty, which is a little rough dependency wise.
    // maybe we pass a callback function that creates the stack?  maybe I'm learning
    // something since Voynich
    // ... although for the on complete callbacks I think I need the game state to
    // call them anyways so that's fun, maybe just pass the game who knows..
    // so this needs to become a game class?  I love replicating Voynich actually
    private createEmptyStack() {
        // cap sandwich count at 6
        if (this.sandwiches.length >= 6) return;

        const div = document.createElement("div");
        const sandwich = new Sandwich(div);
        
        div.ondrop = this.dropHandler.bind(this, this.sandwiches.length);
        div.ondragenter = this.canDropCurrentlyHeld.bind(this, this.sandwiches.length);
        div.ondragover = this.canDropCurrentlyHeld.bind(this, this.sandwiches.length);

        this.boardDiv.appendChild(div);
        sandwich.sandwichStartedCallback = this.createEmptyStack.bind(this);
        sandwich.animationDoneCallback = this.sandwichAnimationEndCallback;
        this.sandwiches.push(sandwich);
    }

    // can this ingredient be played currently?  nothing about which stacks are possible right now
    private canPlay(ingId: number) {
        const ing = ingredients.get(this.availableIngredients[ingId]);
        return (ing.cost <= this.actionPoints.current && this.ingredientCounts[ingId] > 0);
    }

    private hoverCard(ingId: number, ev: MouseEvent) {
        ev.stopPropagation();
        const elt = (ev.target as HTMLElement).parentElement;
        if (this.canPlay(ingId)) {
            elt.classList.add("canPlay");
        }
        else {
            elt.classList.add("cantPlay");
        }
    }

    private unhoverCard(ev: MouseEvent) {
        ev.stopPropagation();
        const elt = (ev.target as HTMLElement).parentElement;
        elt.classList.remove("canPlay");
        elt.classList.remove("cantPlay");
    }

    // start dragging card to play
    private dragCard(ingId: number, ev: DragEvent) {
        ev.stopPropagation();
        if (!this.canPlay(ingId)) {
            ev.preventDefault();
            return;
        }
        else {
            this.currentlyDraggedIngredient = ingredients.get(this.availableIngredients[ingId]);

            // show valid targets
            for (const sandwich of this.sandwiches) {
                sandwich.showIfValidTarget(this.currentlyDraggedIngredient);
            }

            ev.dataTransfer.setData("ingId", ingId.toString());
            ev.dataTransfer.dropEffect = "copy";
            (ev.target as HTMLElement).classList.add("dragging");
            this.actionPoints.tentativeSpend(this.currentlyDraggedIngredient.cost);
        }
    }

    private stopDrag(ev: DragEvent) {
        ev.stopPropagation();
        (ev.target as HTMLElement).classList.remove("dragging");
        this.actionPoints.clearSpend();

        // clear sandwich colors
        for (const sandwich of this.sandwiches) {
            sandwich.clearTargetColors();
        }
    }

    private canDropCurrentlyHeld(sandwichId: number, ev: DragEvent) {
        if(this.sandwiches[sandwichId].canAddIngredient(this.currentlyDraggedIngredient)) {
            ev.preventDefault();
        }
    }

    private dropHandler(stackId: number, ev: DragEvent) {
        ev.stopPropagation();

        const ingId = ev.dataTransfer.getData("ingId");
        const ing = ingredients.get(this.availableIngredients[ingId]);
        if(this.sandwiches[stackId].addIngredient(ing)) {
            ev.preventDefault();
            this.ingredientCounts[ingId]--;
            this.actionPoints.spend();
            this.render();
        }
    }

}