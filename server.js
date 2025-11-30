const WebSocket = require('ws');
const http = require('http');

const PORT = 8080;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active game sessions
const gameSessions = new Map();
// Map player WebSocket to their session
const playerSessions = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      handleMessage(ws, data);
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    handleDisconnect(ws);
  });
});

function handleMessage(ws, data) {
  switch (data.type) {
    case 'JOIN_GAME':
      handleJoinGame(ws, data);
      break;
    case 'DECK_SELECTED':
      handleDeckSelected(ws, data);
      break;
    case 'TURN_END':
      handleTurnEnd(ws, data);
      break;
    case 'BOARD_UPDATE':
      handleBoardUpdate(ws, data);
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

function handleJoinGame(ws, data) {
  const gameId = data.gameId || 'default';
  
  // Get or create game session
  if (!gameSessions.has(gameId)) {
    gameSessions.set(gameId, {
      id: gameId,
      players: [],
      ready: false
    });
  }

  const session = gameSessions.get(gameId);
  const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add player to session
  session.players.push({
    id: playerId,
    ws: ws
  });
  playerSessions.set(ws, { sessionId: gameId, playerId });

  console.log(`Player ${playerId} joined game ${gameId} (${session.players.length}/2 players)`);

  // Notify player they joined
  ws.send(JSON.stringify({
    type: 'JOINED',
    playerId: playerId,
    gameId: gameId
  }));

  // If we have 2 players, notify both that the game can start
  if (session.players.length === 2) {
    session.ready = true;
    session.players.forEach(player => {
      player.ws.send(JSON.stringify({
        type: 'GAME_READY',
        gameId: gameId
      }));
    });
  }
}

function handleDeckSelected(ws, data) {
  const playerInfo = playerSessions.get(ws);
  if (!playerInfo) return;

  const session = gameSessions.get(playerInfo.sessionId);
  if (!session) return;

  // Broadcast deck selection to other player
  session.players.forEach(player => {
    if (player.ws !== ws) {
      player.ws.send(JSON.stringify({
        type: 'DECK_SELECTED',
        playerId: playerInfo.playerId
      }));
    }
  });
}

function handleTurnEnd(ws, data) {
  const playerInfo = playerSessions.get(ws);
  if (!playerInfo) return;

  const session = gameSessions.get(playerInfo.sessionId);
  if (!session) return;

  // Broadcast turn end with actions to other player
  session.players.forEach(player => {
    if (player.ws !== ws) {
      player.ws.send(JSON.stringify({
        type: 'TURN_END',
        playerId: playerInfo.playerId,
        actions: data.actions || []
      }));
    }
  });
}

function handleBoardUpdate(ws, data) {
  const playerInfo = playerSessions.get(ws);
  if (!playerInfo) return;

  const session = gameSessions.get(playerInfo.sessionId);
  if (!session) return;

  // Broadcast board update to other player
  session.players.forEach(player => {
    if (player.ws !== ws) {
      player.ws.send(JSON.stringify({
        type: 'BOARD_UPDATE',
        playerId: playerInfo.playerId,
        board: data.board
      }));
    }
  });
}

function handleDisconnect(ws) {
  const playerInfo = playerSessions.get(ws);
  if (playerInfo) {
    const session = gameSessions.get(playerInfo.sessionId);
    if (session) {
      // Remove player from session
      session.players = session.players.filter(p => p.ws !== ws);
      
      // Notify other player
      session.players.forEach(player => {
        player.ws.send(JSON.stringify({
          type: 'PLAYER_DISCONNECTED',
          playerId: playerInfo.playerId
        }));
      });

      // Clean up empty sessions
      if (session.players.length === 0) {
        gameSessions.delete(playerInfo.sessionId);
      }
    }
    playerSessions.delete(ws);
  }
}

server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
  console.log(`To expose via cloudflared, run: cloudflared tunnel --url http://localhost:${PORT}`);
});

