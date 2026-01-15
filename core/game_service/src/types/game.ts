// Game constants
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 100;
export const BALL_SIZE = 10;
export const PADDLE_SPEED = 8;
export const BALL_SPEED = 6;
export const WINNING_SCORE = 5;

// Game state types
export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface Paddle {
  y: number;
  score: number;
}

export interface Ball {
  position: Position;
  velocity: Velocity;
}

export interface GameState {
  ball: Ball;
  paddles: {
    player1: Paddle;
    player2: Paddle;
  };
  status: 'waiting' | 'playing' | 'paused' | 'finished';
  winner?: 1 | 2;
}

// WebSocket message types
export type ClientMessage =
  | { type: 'CREATE_ROOM' }
  | { type: 'JOIN_ROOM'; roomId: string }
  | { type: 'PADDLE_MOVE'; direction: 'up' | 'down' | 'stop' }
  | { type: 'PLAYER_READY' };

export type ServerMessage =
  | { type: 'ROOM_CREATED'; roomId: string }
  | { type: 'ROOM_JOINED'; roomId: string; playerNumber: 1 | 2 }
  | { type: 'PLAYER_JOINED'; playerNumber: 1 | 2 }
  | { type: 'PLAYER_READY_ACK'; playerNumber: 1 | 2 }
  | { type: 'WAITING_FOR_PLAYER' }
  | { type: 'GAME_START' }
  | { type: 'GAME_STATE'; state: GameState }
  | { type: 'GAME_OVER'; winner: 1 | 2 }
  | { type: 'PLAYER_DISCONNECTED' }
  | { type: 'ERROR'; message: string };
