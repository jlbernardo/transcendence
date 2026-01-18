import { WebSocket } from 'ws';
import { GameEngine } from './GameEngine.js';
import { ServerMessage, ClientMessage } from '../types/game.js';

interface Player {
  ws: WebSocket;
  playerNumber: 1 | 2;
  ready: boolean;
}

export class GameRoom {
  readonly id: string;
  private players: Map<WebSocket, Player> = new Map();
  private engine: GameEngine;
  private gameLoop: NodeJS.Timeout | null = null;
  private readonly TICK_RATE = 1000 / 60; // 60 FPS

  constructor(id: string) {
    this.id = id;
    this.engine = new GameEngine();
  }

  addPlayer(ws: WebSocket): 1 | 2 | null {
    if (this.players.size >= 2)
      return null;

    const playerNumber: 1 | 2 = this.players.size === 0 ? 1 : 2;
    this.players.set(ws, { ws, playerNumber, ready: false });

    return playerNumber;
  }

  removePlayer(ws: WebSocket): void {
    const player = this.players.get(ws);
    if (player) {
      this.players.delete(ws);
      this.stopGame();
    }
  }

  handleMessage(ws: WebSocket, message: ClientMessage): void {
    const player = this.players.get(ws);

    if (!player)
		return;

    switch (message.type) {
      case 'PLAYER_READY':
        this.handlePlayerReady(player);
        break;
      case 'PADDLE_MOVE':
        this.handlePaddleMove(player, message.direction);
        break;
    }
  }

  private handlePlayerReady(player: Player): void {
    player.ready = true;
    console.log(`Player ${player.playerNumber} is ready`);

    // Notifies everyone else that the player is ready
    this.broadcast({ type: 'PLAYER_READY_ACK', playerNumber: player.playerNumber });

    const allReady = Array.from(this.players.values()).every(p => p.ready);
    console.log(`All ready: ${allReady}, player count: ${this.players.size}`);

    if (this.players.size === 2 && allReady) {
      console.log('Starting game!');
      this.startGame();
    }
  }

  private handlePaddleMove(player: Player, direction: 'up' | 'down' | 'stop'): void {
    this.engine.setPlayerDirection(player.playerNumber, direction);
  }

  private startGame(): void {
    this.engine.startGame();
    this.broadcast({ type: 'GAME_START' });

    this.gameLoop = setInterval(() => {
      this.tick();
    }, this.TICK_RATE);
  }

  private stopGame(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }

  private tick(): void {
    this.engine.update();
    const state = this.engine.getState();

    this.broadcast({ type: 'GAME_STATE', state });

    if (state.status === 'finished' && state.winner) {
      this.broadcast({ type: 'GAME_OVER', winner: state.winner });
      this.stopGame();
    }
  }

  private broadcast(message: ServerMessage): void {
    const data = JSON.stringify(message);
    for (const player of this.players.values()) {
      if (player.ws.readyState === WebSocket.OPEN)
        player.ws.send(data);
    }
  }

  notifyPlayerJoined(): void {
    // Notifies all players that someone joined - both should know about each other
    this.broadcast({ type: 'PLAYER_JOINED', playerNumber: 2 });
  }

  isEmpty(): boolean {
    return this.players.size === 0;
  }

  isFull(): boolean {
    return this.players.size >= 2;
  }

  getPlayerWebSockets(): WebSocket[] {
    return Array.from(this.players.keys());
  }
}
