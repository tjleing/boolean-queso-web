import { ComPlayer } from "./comPlayer";
import { Game } from "./game";
import { LocalPlayer } from "./localPlayer";

const player1 = new LocalPlayer(
    document.getElementById("ingredients"),
    document.getElementById("myBoard")
);
const player2 = new ComPlayer(
    document.getElementById("opponentBoard")
);
new Game([player1, player2]);
