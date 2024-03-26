import { ActionPoints } from "./actionpoints";
import { ingredients } from "./ingredients";
import { Player } from "./player";
import { Sandwich } from "./sandwich";
import { Animatable } from "./types";

export class LocalPlayer implements Player {
    score: number;
    deckSelectEndCallback: () => void;
    turnEndCallback: () => void;
    animationEndCallback: () => void;

    private ingredientDiv = document.getElementById("ingredients");
    private availableIngredients: string[] = [
        "white bread",
        "bacon",
        // "tomato",
        // "ranch"
    ];
    private ingredientCounts: number[] = Array(this.availableIngredients.length).fill(0);
    private ingredientDOMs: HTMLSpanElement[] = [];
    private boardDiv = document.getElementById("myBoard");
    private sandwiches: Sandwich[] = [];
    private actionPoints = new ActionPoints();
    private endTurnButton = document.getElementById("endTurnButton") as HTMLButtonElement;

    startDeckSelect() {
        // TODO: actually select a deck here
        this.deckSelectEndCallback();
    }

    startGame() {
        for (let i = 0; i<this.ingredientCounts.length; ++i) {
            this.ingredientCounts[i] = 0;
        }

        this.constructDOM();
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
        const div = document.createElement("div");
        
        div.ondrop = this.dropHandler.bind(this, 0);
        div.ondragenter = (ev: DragEvent) => ev.preventDefault();
        div.ondragover = (ev: DragEvent) => ev.preventDefault();

        this.boardDiv.appendChild(div);
        const sandwich = new Sandwich(div);
        sandwich.animationDoneCallback = this.playAnimation.bind(this);
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
            const ing = ingredients.get(this.availableIngredients[ingId]);
            ev.dataTransfer.setData("ingId", ingId.toString());
            ev.dataTransfer.dropEffect = "copy";
            (ev.target as HTMLElement).classList.add("dragging");
            this.actionPoints.tentativeSpend(ing.cost);
        }
    }

    private stopDrag(ev: DragEvent) {
        ev.stopPropagation();
        (ev.target as HTMLElement).classList.remove("dragging");
        this.actionPoints.clearSpend();
    }

    private dropHandler(stackId: number, ev: DragEvent) {
        ev.stopPropagation();
        ev.preventDefault();
        const ingId = ev.dataTransfer.getData("ingId");
        const ing = ingredients.get(this.availableIngredients[ingId]);
        this.ingredientCounts[ingId]--;
        this.actionPoints.spend();
        this.render();

        this.sandwiches[stackId].addIngredient(ing);
    }

    animationCounter = 0;
    animations: Animatable[] = [];
    startPlayingAnimations() {
        this.animationCounter = 0;
        this.animations = [];
        for(const sandwich of this.sandwiches) {
            this.animations.push(sandwich);
            sandwich.prepAnimate();
        }
        this.playAnimation();
    }

    playAnimation() {
        if(this.animationCounter >= this.animations.length) {
            this.animationEndCallback();
        }
        else {
            this.animations[this.animationCounter++].animate();
        }
    }
}