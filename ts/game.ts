import { Player } from "./player";
import { TurnState } from "./types";

export class Game {
    players: Player[];
    deckSelects = 0;
    turnEnds = 0;
    animationEnds = 0;

    turnState: TurnState;

    constructor(players: Player[]) {
        this.players = players;
        for(const player of players) {
            player.turnEndCallback = this.endTurnForPlayer.bind(this);
            player.deckSelectEndCallback = this.selectDeckForPlayer.bind(this);
            player.animationEndCallback = this.endAnimationsForPlayer.bind(this);
            player.startDeckSelect();
        }
        this.turnState = TurnState.SELECTING_DECK;
    }

    private selectDeckForPlayer() {
        this.deckSelects++;
        if (this.deckSelects === this.players.length) {
            this.turnState = TurnState.TURN_ACTIVE;
            for (const player of this.players) {
                player.startGame();
            }
            this.deckSelects = 0;
        }
    }

    private endTurnForPlayer() {
        this.turnEnds++;
        if (this.turnEnds === this.players.length) {
            this.turnState = TurnState.ANIMS_PLAYING;
            for (const player of this.players) {
                player.startPlayingAnimations();
            }
            this.turnEnds = 0;
        }
    }

    private endAnimationsForPlayer() {
        this.animationEnds++;
        if (this.animationEnds === this.players.length) {
            this.turnState = TurnState.TURN_ACTIVE;
            // TODO: ... unless the game is over, in that case go to that state instead
            for (const player of this.players) {
                player.startTurn();
            }
            this.animationEnds = 0;
        }
    }
}