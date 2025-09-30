# Makefiles are much better for scripts than package.json in my opinion,
# because you can comment them.

# Build the docker image. The Dockerfile handles the npm build internally.
.PHONY: docker/build
docker/build:
	docker build frontend -f frontend/Dockerfile.reactUI -t docker-mern-example:latest

# Run the containerized frontend (accessible at http://localhost:3000).
.PHONY: docker/run
docker/run:
	docker run -p 3000:80 --rm docker-mern-example:latest