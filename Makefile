DOCKER_FILE := ./docker/Dockerfile
DOCKER_FILE_DEV := ./docker/Dockerfile.dev

DOCKER_APP_NAME := groupware-whitelabel-app

DOCKER_DEV := -f docker-compose-dev.yml
DOCKER_DEV_EXEC := ${DOCKER_DEV} exec ${DOCKER_APP_NAME}

DOCKER_IMAGES := app-groupware-whitelabel:latest
DOCKER_IMAGES_DEV := app-groupware-whitelabel-dev:latest

install:
	npm install

build:
	npm run build

start:
	npm run start

dev:
	npm run start:dev

lint:
	npm run lint

migrate:
	npm run migration:run

rollback:
	npm run migration:revert

seed:
	npm run seed:run

docker-build:
	docker build -f ${DOCKER_FILE} -t ${DOCKER_IMAGES} .

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

docker-run-dev-build:
	docker build -f ${DOCKER_FILE_DEV} -t ${DOCKER_IMAGES_DEV} .

docker-run-dev:
	docker-compose ${DOCKER_DEV} up -d

docker-run-dev-stop:
	docker-compose ${DOCKER_DEV} down

docker-run-dev-test:
	docker-compose ${DOCKER_DEV_EXEC} npm run test

docker-run-dev-coverage:
	docker-compose ${DOCKER_DEV_EXEC} npm run test:cov

docker-run-dev-migrate:
	docker-compose ${DOCKER_DEV_EXEC} npm run migration:run

docker-run-dev-rollback:
	docker-compose ${DOCKER_DEV_EXEC} npm run migration:revert

docker-run-dev-seed:
	docker-compose ${DOCKER_DEV_EXEC} npm run seed:run