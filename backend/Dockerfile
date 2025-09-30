# Use the official Node.js LTS image for production.
FROM node:24.9.0-bookworm-slim

# Create app directory.
WORKDIR /app

# Copy package files first for better layer caching.
COPY package.json package-lock.json* ./

# Install only production dependencies (no devDependencies).
RUN npm ci --only=production

# Copy application source code.
COPY . .

# Expose the port the backend runs on (default 3001).
EXPOSE 3001

# Health check for AWS App Runner / ECS.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run the backend.
CMD ["npm", "start"]