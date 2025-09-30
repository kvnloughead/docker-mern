# Makefiles are much better for scripts than package.json in my opinion,
# because you can comment them.

# ============================================================
# FRONTEND
# ============================================================

## docker/frontend/build: build the frontend Docker image
.PHONY: docker/frontend/build
docker/frontend/build:
	docker build frontend -f frontend/Dockerfile.reactUI -t wtwr-frontend:latest

## docker/frontend/run: run the containerized frontend (accessible at http://localhost:3000)
.PHONY: docker/frontend/run
docker/frontend/run:
	docker run -p 3000:80 --rm wtwr-frontend:latest

# ============================================================
# BACKEND
# ============================================================

## docker/backend/build: build the backend Docker image
.PHONY: docker/backend/build
docker/backend/build:
	docker build backend -f backend/Dockerfile -t wtwr-backend:latest

## docker/backend/run: run the containerized backend (accessible at http://localhost:3001)
## Requires MongoDB to be running at host.docker.internal:27017
.PHONY: docker/backend/run
docker/backend/run:
	docker run -p 3001:3001 --rm \
		-e MONGODB_URI=mongodb://host.docker.internal:27017/wtwr_db \
		wtwr-backend:latest

# ============================================================
# FULL STACK (using Docker Compose)
# ============================================================

## docker/up: start the full stack (frontend + backend + MongoDB) via docker-compose
.PHONY: docker/up
docker/up:
	docker-compose up

## docker/down: stop the full stack
.PHONY: docker/down
docker/down:
	docker-compose down

## docker/build: build all Docker images (frontend + backend)
.PHONY: docker/build
docker/build: docker/frontend/build docker/backend/build

# ============================================================
# HELPERS
# ============================================================

## help: print this help message
.PHONY: help
help:
	@echo "\nUsage: \n"
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'