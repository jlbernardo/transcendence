# Builds stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copies package files
COPY package*.json ./

# Installs all dependencies (including devDependencies for build)
RUN npm ci

# Copies source code
COPY tsconfig.json ./
COPY src ./src

# Builds TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS game-server

WORKDIR /app

# Copies package files
COPY package*.json ./

# Installs only production dependencies
RUN npm ci --only=production

# Copies built files from builder stage
COPY --from=builder /app/dist ./dist

# Exposes the server port
EXPOSE 3001

# Sets environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Runsgs the server
CMD ["node", "dist/index.js"]
