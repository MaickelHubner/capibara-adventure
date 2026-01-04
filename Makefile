.PHONY: build up down logs shell clean

# Constrói a imagem Docker
build:
	docker-compose build

# Sobe o container (jogo rodando em http://localhost:7777)
up:
	docker-compose up -d
	@echo ""
	@echo "🎮 Capibara Adventure rodando!"
	@echo "📍 Acesse: http://localhost:7777"
	@echo ""

# Para e remove o container
down:
	docker-compose down

# Mostra os logs do container
logs:
	docker-compose logs -f

# Acessa o shell do container
shell:
	docker-compose exec game sh

# Remove containers, imagens e volumes órfãos
clean:
	docker-compose down --rmi local --volumes --remove-orphans
