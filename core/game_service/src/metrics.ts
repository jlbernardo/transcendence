import { Registry, Gauge, Counter, collectDefaultMetrics } from 'prom-client';

// Create a custom registry
export const register = new Registry();

// Enable default Node.js metrics (CPU, memory, event loop lag, etc.)
collectDefaultMetrics({ register });

// Custom game metrics

export const activeRooms = new Gauge({
  name: 'game_rooms_active',
  help: 'Number of currently active game rooms',
  registers: [register],
});

export const activeConnections = new Gauge({
  name: 'game_connections_active',
  help: 'Number of active WebSocket connections',
  registers: [register],
});

export const totalConnections = new Counter({
  name: 'game_connections_total',
  help: 'Total WebSocket connections since startup',
  registers: [register],
});
