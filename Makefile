DOCKER_COMPOSE_DEV = docker compose --env-file .env.dev --file docker-compose.dev.yml

dev-build:
	$(DOCKER_COMPOSE_DEV) build

dev-start:
	$(DOCKER_COMPOSE_DEV) up

dev-stop:
	$(DOCKER_COMPOSE_DEV) down

dev-restart: dev-stop dev-start -d

clean:
	docker system prune --force	

fclean:
	docker system prune --all --force

clean-volume:
	docker volume rm $(docker volume ls -q)

help:
	@echo ""
	@echo "Usage:"
	@echo "  make dev-build   :: build development services"
	@echo "  make dev-start   :: start development containers"
	@echo "  make dev-stop    :: stop development containers"
	@echo "  make dev-restart :: restart development containers"
	@echo "  make prod-build  :: build production services"
	@echo "  make prod-start  :: start production containers"
	@echo "  make prod-stop   :: stop production containers"
	@echo "  make prod-restart:: restart production containers"
	@echo "  make clean       :: clean unused containers and data"
	@echo "  make fclean      :: full clean of containers and images"
	@echo ""