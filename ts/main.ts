import { Game } from "./game";
import { ComPlayer } from "./comPlayer";
import { LocalPlayer } from "./localPlayer";
import { RemotePlayer } from "./remotePlayer";
import { GameClient } from "./remoteGameClient";

function startWithComPlayer() {
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
}

function startWithRemotePlayer() {
    // Get server URL from URL params or use default
    const urlParams = new URLSearchParams(window.location.search);
    const serverUrl = urlParams.get('serverUrl') || 'ws://localhost:8080';
    
    const gameClient = new GameClient(serverUrl);
    
    // Initialize game with remote player
    const player1 = new LocalPlayer(
        document.getElementById("ingredients"),
        document.getElementById("myBoard"),
        document.getElementById("myScores"),
        gameClient
    );
    
    const player2 = new RemotePlayer(
        document.getElementById("opponentBoard"),
        document.getElementById("opponentScores"),
        gameClient
    );
    new Game([player1, player2]);
}

startWithRemotePlayer();
