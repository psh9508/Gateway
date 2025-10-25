# Build stage
FROM node:18-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install curl
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /build/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthcheck || exit 1

# Start the application
CMD ["node", "dist/main.js"]
