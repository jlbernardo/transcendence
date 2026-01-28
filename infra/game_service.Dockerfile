# Builds stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copies package files
COPY core/game_service/package*.json ./

# Installs all dependencies (including devDependencies for build)
RUN npm ci

# Copies source code
COPY core/game_service/tsconfig.json ./
COPY core/game_service/src ./src

# Builds TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS game-server

WORKDIR /app

# Copies package files
COPY core/game_service/package*.json ./

# Installs only production dependencies
RUN npm ci --only=production

# Copies built files from builder stage
COPY --from=builder /app/dist ./dist

# Exposes the server port
EXPOSE 3002

# Sets environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Runs the server
CMD ["node", "dist/index.js"]
