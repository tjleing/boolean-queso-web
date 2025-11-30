export class GameClient {
  private webSocket: WebSocket | null = null;
  private playerId: string | null = null;
  private gameId: string | null = null;
  
  // Default to localhost for development, but can be overridden with cloudflared URL
  // To use cloudflared, set this to the cloudflared tunnel URL (e.g., wss://xxxxx.trycloudflare.com)
  private serverUrl: string = 'ws://localhost:8080';

  constructor(serverUrl?: string) {
    if (serverUrl) {
      this.serverUrl = serverUrl;
    } else {
      // Try to get from localStorage or URL params
      const savedUrl = localStorage.getItem('gameServerUrl');
      if (savedUrl) {
        this.serverUrl = savedUrl;
      }
    }
  }

  async joinOrCreateGame(callback: (message: string) => void): Promise<void> {
    try {
      // Get game ID from URL params or use default
      const urlParams = new URLSearchParams(window.location.search);
      this.gameId = urlParams.get('gameId') || 'default';

      // Connect to WebSocket server
      this.connectToGameServer(callback);
    } catch (error) {
      console.error("Error joining/creating game:", error);
    }
  }

  private connectToGameServer(callback: (message: string) => void): void {
    console.log(`Connecting to game server at ${this.serverUrl}`);
    
    this.webSocket = new WebSocket(this.serverUrl);
    
    this.webSocket.onopen = () => {
      console.log('WebSocket connection opened');
      // Send join game message
      this.webSocket!.send(JSON.stringify({
        type: 'JOIN_GAME',
        gameId: this.gameId
      }));
    };

    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle connection-specific messages
      if (data.type === 'JOINED') {
        this.playerId = data.playerId;
        this.gameId = data.gameId;
        console.log(`Joined game as ${this.playerId}`);
      } else if (data.type === 'GAME_READY') {
        console.log('Game is ready!');
      } else if (data.type === 'ERROR') {
        console.error('Server error:', data.message);
      }
      
      // Forward all messages to the callback
      callback(event.data);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed');
      this.webSocket = null;
    };
  }

  public sendMessageToGameServer(message: string | object): void {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      console.error('No WebSocket connection available');
      return;
    }
    
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    this.webSocket.send(messageStr);
  }

  public setServerUrl(url: string): void {
    this.serverUrl = url;
    localStorage.setItem('gameServerUrl', url);
  }
}
