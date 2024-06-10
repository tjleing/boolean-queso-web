import { SCORE_THRESHOLD } from "./constants";
import { Player } from "./player";
import { Animatable, TurnState } from "./types";

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
            player.sandwichAnimationEndCallback = this.playAnimation.bind(this);
            player.startDeckSelect();
        }
        this.turnState = TurnState.SELECTING_DECK;
    }

    private selectDeckForPlayer() {
        this.deckSelects++;
        if (this.deckSelects === this.players.length) {
            this.deckSelects = 0;
            this.turnState = TurnState.TURN_ACTIVE;
            for (const player of this.players) {
                player.startGame();
            }
        }
    }

    // TODO: turn order
    // TODO: guessing we want some sort of UI that's like "oh no your opponent has a win
    //          on the board, you'd better have closed a sandwich" during this
    private endTurnForPlayer() {
        this.turnEnds++;
        if (this.turnEnds === this.players.length) {
            this.turnEnds = 0;
            this.turnState = TurnState.ANIMS_PLAYING;
            this.animationCounter = 0;
            this.animations = [];
            for (const player of this.players) {
                const anims = player.getAnimationActions();
                this.animations.push(...anims);
            }

            this.playAnimation();
        }
    }
    private animationCounter: number;
    private animations: Animatable[];

    protected playAnimation() {
        if(this.animationCounter >= this.animations.length) {
            this.turnState = TurnState.TURN_ACTIVE;

            // TODO: better win logic, better end screen
            let winners = [];
            for (const player of this.players) {
                if (player.score >= SCORE_THRESHOLD) {
                    winners.push(player.name);
                }
            }

            if (winners.length !== 0) {
                alert("Winner: " + winners.join(" and "));
            }
            else {
                for (const player of this.players) {
                    player.startTurn();
                }
            }
        }
        else {
            this.animations[this.animationCounter++].animate();
        }
    }
}