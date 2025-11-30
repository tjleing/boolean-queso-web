import { Player } from "./player";
import { GameClient } from "./remoteGameClient";
import { Sandwich } from "./sandwich";
import { DeserializedSandwich, SerializedSandwich } from "./types";

// so the concept for the remote player is they send an endturn
// event with all of the actions they plan on taking, and then
// at this point we actually start enacting them.  and it's
// symmetrical too, which is cool
export class RemotePlayer extends Player {
    score: number;
    deckSelectEndCallback: () => void;
    turnEndCallback: () => void;
    animationEndCallback: () => void;
    private gc: GameClient;
    pendingActions: DeserializedSandwich[] = [];

    scoresDiv: HTMLDivElement;
    constructor(boardDiv, scoresDiv, gc) {
        super();
        this.name = "Computer Player";
        this.boardDiv = boardDiv;
        this.scoresDiv = scoresDiv;
        this.gc = gc;
        this.sandwiches = new Map();

        this.gc.joinOrCreateGame(this.handleServerMessage.bind(this));
    }

    handleServerMessage(message: string) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'DECK_SELECTED':
                // Remote player has selected their deck
                this.deckSelectEndCallback();
                break;
            case 'TURN_END':
                // Store the actions to be played during animation phase
                if (Array.isArray(data.actions)) {
                    this.pendingActions = data.actions.map((action: SerializedSandwich) => Sandwich.deserialize(action));
                } else {
                    this.pendingActions = [];
                }
                this.turnEndCallback();
                break;
            case 'BOARD_UPDATE':
                // Update the visual state of the board
                // TODO: Implement board update logic
                console.log('Board update received:', data.board);
                break;
        }
    }

    startDeckSelect() {
        // Wait for remote player to select deck
        // Visual indication that opponent is selecting deck
        this.boardDiv.innerHTML = "Opponent is selecting cards...";
    }

    startGame() {
        this.constructDOM();
        this.startTurn();
    }

    private constructDOM() {
        this.boardDiv.innerHTML = "";
        this.createEmptyStack();

        var div = document.createElement("div");
        div.innerText = "Score: ";
        this.scoreSpan = document.createElement("span");
        div.appendChild(this.scoreSpan);
        this.scoreSpan.innerText = "0";
        this.scoresDiv.appendChild(div);
    }
}