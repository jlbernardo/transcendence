import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { createServer as httpsCreateServer } from 'https';
import { WebSocketServer, WebSocket } from 'ws';
import { GameRoom } from './game/GameRoom.js';
import { ClientMessage, ServerMessage } from './types/game.js';
import { register, activeRooms, activeConnections, totalConnections } from './metrics.js';
import { readFileSync } from 'fs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Middleware
app.use(cors());
app.use(express.json());

// Room management
const rooms = new Map<string, GameRoom>();
const playerRooms = new Map<WebSocket, string>();

// Room ID generation
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Client messaging
function send(ws: WebSocket, message: ServerMessage): void {
  if (ws.readyState === WebSocket.OPEN)
    ws.send(JSON.stringify(message));
}

// WebSocket connection handler
wss.on('connection', (ws: WebSocket, req) => {
  console.log('New client connected');
  activeConnections.inc();
  totalConnections.inc();

  ws.on('message', (data: Buffer) => {
    try {
      const message: ClientMessage = JSON.parse(data.toString());
      handleMessage(ws, message);
    }
	catch (error) {
      console.error('Failed to parse message:', error);
      send(ws, { type: 'ERROR', message: 'Invalid message format' });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    activeConnections.dec();
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    handleDisconnect(ws);
  });
});

function handleMessage(ws: WebSocket, message: ClientMessage): void {
  switch (message.type) {
    case 'CREATE_ROOM':
      handleCreateRoom(ws);
      break;
    case 'JOIN_ROOM':
      handleJoinRoom(ws, message.roomId);
      break;
    case 'LEAVE_ROOM':
      handleLeaveRoom(ws);
      break;
    case 'PADDLE_MOVE':
    case 'PLAYER_READY':
      handleGameMessage(ws, message);
      break;
    default:
      send(ws, { type: 'ERROR', message: 'Unknown message type' });
  }
}

function handleCreateRoom(ws: WebSocket): void {
  if (playerRooms.has(ws)) {
    send(ws, { type: 'ERROR', message: 'Already in a room' });
    return;
  }

  let roomId = generateRoomId();

  while (rooms.has(roomId))
    roomId = generateRoomId();

  const room = new GameRoom(roomId);
  const playerNumber = room.addPlayer(ws);

  if (playerNumber === null) {
    send(ws, { type: 'ERROR', message: 'Failed to create room' });
    return;
  }

  rooms.set(roomId, room);
  playerRooms.set(ws, roomId);
  activeRooms.inc();

  console.log(`Room ${roomId} created by player ${playerNumber}`);

  send(ws, { type: 'ROOM_CREATED', roomId });
  send(ws, { type: 'ROOM_JOINED', roomId, playerNumber });
  send(ws, { type: 'WAITING_FOR_PLAYER' });
}

function handleJoinRoom(ws: WebSocket, roomId: string): void {
  if (playerRooms.has(ws)) {
    send(ws, { type: 'ERROR', message: 'Already in a room' });
    return;
  }

  const room = rooms.get(roomId.toUpperCase());

  if (!room) {
    send(ws, { type: 'ERROR', message: 'Room not found' });
    return;
  }

  if (room.isFull()) {
    send(ws, { type: 'ERROR', message: 'Room is full' });
    return;
  }

  const playerNumber = room.addPlayer(ws);

  if (playerNumber === null) {
    send(ws, { type: 'ERROR', message: 'Failed to join room' });
    return;
  }

  playerRooms.set(ws, room.id);

  console.log(`Player ${playerNumber} joined room ${room.id}`);

  send(ws, { type: 'ROOM_JOINED', roomId: room.id, playerNumber });
  room.notifyPlayerJoined();
}

function handleLeaveRoom(ws: WebSocket): void {
  const roomId = playerRooms.get(ws);

  if (!roomId) {
    send(ws, { type: 'ROOM_LEFT' });
    return;
  }

  const room = rooms.get(roomId);

  if (room) {
    room.removePlayer(ws);

    if (room.isEmpty()) {
      rooms.delete(roomId);
      activeRooms.dec();
      console.log(`Room ${roomId} deleted (last player left)`);
    }
    // Don't delete room or notify remaining player - they can stay on post-match screen
  }

  playerRooms.delete(ws);
  send(ws, { type: 'ROOM_LEFT' });
  console.log(`Player left room ${roomId}`);
}

function handleGameMessage(ws: WebSocket, message: ClientMessage): void {
  const roomId = playerRooms.get(ws);

  if (!roomId) {
    send(ws, { type: 'ERROR', message: 'Not in a room' });
    return;
  }

  const room = rooms.get(roomId);

  if (!room) {
    send(ws, { type: 'ERROR', message: 'Room not found' });
    return;
  }

  room.handleMessage(ws, message);
}

function handleDisconnect(ws: WebSocket): void {
  const roomId = playerRooms.get(ws);

  if (roomId) {
    const room = rooms.get(roomId);

    if (room) {
      const allPlayerWs = room.getPlayerWebSockets();

      // Notify remaining players before removing
      for (const playerWs of allPlayerWs) {
        if (playerWs !== ws) {
          send(playerWs, { type: 'PLAYER_DISCONNECTED' });
        }
      }

      room.removePlayer(ws);

      if (room.isEmpty()) {
        rooms.delete(roomId);
        activeRooms.dec();
        console.log(`Room ${roomId} deleted (empty)`);
      }
	  else {
        for (const playerWs of allPlayerWs) {
          if (playerWs !== ws) {
            playerRooms.delete(playerWs);
            console.log(`Cleaned up playerRooms mapping for remaining player in room ${roomId}`);
          }
        }

        rooms.delete(roomId);
        activeRooms.dec();
        console.log(`Room ${roomId} deleted (opponent disconnected)`);
      }
    }

    playerRooms.delete(ws);
  }
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

// Prometheus metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Server setup and initialization
const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';

if (process.env.USE_HTTPS === 'true') {
  const httpsServer = httpsCreateServer({
    // In a real application, use proper SSL certificates
    key: readFileSync('./config/key.pem'), // Provide your SSL key here
    cert: readFileSync('./config/cert.pem') // Provide your SSL certificate here
  }, app);

  httpsServer.listen(Number(PORT), HOST, () => {
    console.log(`HTTPS Server running on https://${HOST}:${PORT}`);
    console.log(`WebSocket endpoint: wss://${HOST}:${PORT}/ws`);
  });

  wss.options.server = httpsServer;
} else {
  server.listen(Number(PORT), HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`WebSocket endpoint: ws://${HOST}:${PORT}/ws`);
  });
}

