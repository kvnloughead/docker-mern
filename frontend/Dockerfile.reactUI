# bookworm is managed by Docker and the slim version is only slightly larger
# than alpine. But I with the newest version, not the LTS.
#
# Reference: https://snyk.io/blog/choosing-the-best-node-js-docker-image/

# Build stage: compile the Vite app
FROM node:24.9.0-bookworm-slim AS build

# Create a working directory on the image
WORKDIR /app

# Copy package files first for better layer caching
COPY ./package.json ./package-lock.json* ./

# Install all dependencies (including devDependencies needed for build)
# ci => "clean install"
RUN npm ci

# Copy source files, including vite configuration
COPY ./public ./public
COPY ./src ./src
COPY ./index.html ./vite.config.js* ./

# Build the production bundle.
RUN npm run build

# Production stage: serve with Caddy (automatic HTTPS)
FROM caddy:2-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/caddy

# Expose ports 80 (HTTP) and 443 (HTTPS).
EXPOSE 80
EXPOSE 443

# Caddy starts automatically using its own image CMD

