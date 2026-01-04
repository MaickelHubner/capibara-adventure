# Capibara Adventure - Contexto do Projeto

## Visão Geral
Jogo de plataforma 2D estilo pixel art (tipo Mario) para mobile (orientação horizontal).
Executado via navegador em `http://localhost:7777`.

## Stack Técnica
- **Engine:** Phaser.js 3
- **Bundler:** Vite
- **Infraestrutura:** Docker + docker-compose
- **Porta:** 7777

## Comandos
```bash
make build  # Constrói a imagem Docker
make up     # Sobe o container
make down   # Para o container
make logs   # Ver logs
make shell  # Acessar container
```

## Personagem Principal
- **Nome:** Capivara (personalizável)
- **Customização:** cor do pelo, acessórios de cabeça, roupa, acessórios extras
- **Movimentos:** andar, pular, nadar, escalar, coletar

## Mecânicas

### Vida e Dano
- 3 vidas iniciais (máximo 5)
- Tocar inimigo (lateral) = perde 1 vida
- Pular em cima do inimigo = derrota (+25 pontos)
- Cair em buraco/água profunda = perde 1 vida, respawna no checkpoint
- Vidas = 0 → Game Over → Reinicia nível

### Pontuação
- Coletável básico: +10 pontos
- Coletável raro: +50 pontos
- Derrotar inimigo: +25 pontos
- Enigma correto: +100 pontos
- Fazer amizade: +200 pontos
- Completar nível: +500 pontos + bônus tempo

### NPCs
- Personagens virtuais para fazer amizade
- Diálogos com frases prontas
- Sistema de amizade (níveis 0-3)
- Presente favorito aumenta amizade

### Enigmas
- Perguntas de múltipla escolha em pontos específicos
- Acertar: pontos + passagem liberada
- Errar: pode tentar novamente (sem pontos)

## Níveis Planejados

| Nível | Cenário | Inimigos |
|-------|---------|----------|
| 1 | Floresta Tropical | Cobras, Macacos |
| 2 | Pantanal | Jacarés, Piranhas |
| 3 | Cerrado | Tatus, Emas |
| 4 | Praia | Caranguejos, Gaivotas |
| 5 | Cidade | Cachorros, Pombos |

## Estrutura de Pastas
```
src/
├── main.js              # Entry point
├── config/              # Configurações
├── scenes/              # Cenas do Phaser
├── entities/            # Player, NPCs, Enemies
├── systems/             # Score, Dialog, Quiz, Friendship
├── data/                # JSONs (levels, npcs, dialogs, quizzes)
└── utils/               # Helpers, controls

assets/
├── sprites/             # Capivara, NPCs, enemies, tiles, items
├── ui/                  # Botões, HUD, diálogos
└── audio/               # Música e efeitos
```

## Sprites
- Tamanho base: 32x32 pixels
- Escala no jogo: 2x
- Estilo: pixel art 16-bit

## Controles Mobile
- Joystick virtual (esquerda) ou botões ◀ ▶
- Botão A: pular
- Botão B: interagir/falar
- Nadar/Escalar: automático + direcionais

## Idioma
- Apenas português (pt-BR)

## Características Importantes
- Níveis curtos (~2 minutos)
- Single player
- Sem sistema de save inicial (possível no futuro)
- Forçar orientação landscape
- Touch controls responsivos
