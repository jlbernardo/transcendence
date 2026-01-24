COMPOSE = docker compose -f infra/docker-compose.yml -p transcendence
SERVICE ?=

all: build up

build:
	$(COMPOSE) build $(SERVICE)    

up:
	$(COMPOSE) up -d $(SERVICE)

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down -v

fclean: clean
	docker builder prune -af
	docker system prune -af --volumes

re: fclean all

.PHONY: build up down clean fclean re