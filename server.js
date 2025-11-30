const WebSocket = require('ws');
const http = require('http');

const PORT = 8080;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active game sessions
const gameSessions = new Map();
// Map player WebSocket to their session
const playerSessions = new Map();

// Helper function for formatted logging
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${type}]`;
  console.log(`${prefix} ${message}`);
}

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress || 'unknown';
  log(`New WebSocket connection from ${clientIp}`, 'CONNECTION');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      log(`Received message: ${data.type}`, 'MESSAGE');
      handleMessage(ws, data);
    } catch (error) {
      log(`Error parsing message: ${error.message}`, 'ERROR');
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    log('WebSocket connection closed', 'CONNECTION');
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    log(`WebSocket error: ${error.message}`, 'ERROR');
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
      log(`Unknown message type: ${data.type}`, 'WARNING');
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
    log(`Created new game session: ${gameId}`, 'SESSION');
  }

  const session = gameSessions.get(gameId);
  const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add player to session
  session.players.push({
    id: playerId,
    ws: ws
  });
  playerSessions.set(ws, { sessionId: gameId, playerId });

  log(`✅ Player ${playerId} joined game "${gameId}" (${session.players.length}/2 players)`, 'PLAYER_JOIN');
  log(`   Active sessions: ${gameSessions.size}, Total players: ${playerSessions.size}`, 'STATUS');

  // Notify player they joined
  ws.send(JSON.stringify({
    type: 'JOINED',
    playerId: playerId,
    gameId: gameId
  }));

  // If we have 2 players, notify both that the game can start
  if (session.players.length === 2) {
    session.ready = true;
    log(`🎮 Game "${gameId}" is ready! Both players connected.`, 'GAME_READY');
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
  if (!playerInfo) {
    log('Deck selected from unknown player', 'WARNING');
    return;
  }

  const session = gameSessions.get(playerInfo.sessionId);
  if (!session) return;

  log(`Player ${playerInfo.playerId} selected deck in game "${playerInfo.sessionId}"`, 'GAME_EVENT');

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

  const actionCount = Array.isArray(data.actions) ? data.actions.length : 0;
  log(`Player ${playerInfo.playerId} ended turn with ${actionCount} actions in game "${playerInfo.sessionId}"`, 'GAME_EVENT');

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

  log(`Board update from player ${playerInfo.playerId} in game "${playerInfo.sessionId}"`, 'GAME_EVENT');

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
      log(`❌ Player ${playerInfo.playerId} disconnected from game "${playerInfo.sessionId}"`, 'PLAYER_LEAVE');
      
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
        log(`Removed empty game session: ${playerInfo.sessionId}`, 'SESSION');
      } else {
        log(`Game "${playerInfo.sessionId}" now has ${session.players.length} player(s)`, 'STATUS');
      }
    }
    playerSessions.delete(ws);
    log(`Active sessions: ${gameSessions.size}, Total players: ${playerSessions.size}`, 'STATUS');
  }
}

server.listen(PORT, () => {
  log('═══════════════════════════════════════════════════════════', 'SERVER');
  log(`🚀 Game server started on port ${PORT}`, 'SERVER');
  log(`📡 WebSocket server ready for connections`, 'SERVER');
  log(`🌐 To expose via cloudflared, run: cloudflared tunnel --url http://localhost:${PORT}`, 'SERVER');
  log('═══════════════════════════════════════════════════════════', 'SERVER');
});

