import { ComPlayer } from "./comPlayer";
import { Game } from "./game";
import { LocalPlayer } from "./localPlayer";

const player1 = new LocalPlayer(
    document.getElementById("ingredients"),
    document.getElementById("myBoard"),
    document.getElementById("myScores")
);
const player2 = new ComPlayer(
    document.getElementById("opponentBoard"),
    document.getElementById("opponentScores")
);
new Game([player1, player2]);
