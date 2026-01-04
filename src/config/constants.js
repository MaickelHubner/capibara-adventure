// Configurações do jogo
export const GAME = {
  TITLE: 'Capibara Adventure',
  VERSION: '1.0.0'
};

// Configurações do player
export const PLAYER = {
  SPEED: 200,
  JUMP_VELOCITY: -400,
  SWIM_SPEED: 150,
  CLIMB_SPEED: 120,
  MAX_LIVES: 5,
  INITIAL_LIVES: 3
};

// Pontuação
export const SCORE = {
  COLLECTIBLE_BASIC: 10,
  COLLECTIBLE_RARE: 50,
  ENEMY_DEFEAT: 25,
  QUIZ_CORRECT: 100,
  FRIENDSHIP: 200,
  LEVEL_COMPLETE: 500
};

// Cores do jogo
export const COLORS = {
  PRIMARY: 0x4a9c2d,      // Verde floresta
  SECONDARY: 0x8b4513,    // Marrom
  ACCENT: 0xffd700,       // Dourado
  BACKGROUND: 0x1a1a2e,   // Azul escuro
  TEXT: 0xffffff,         // Branco
  DANGER: 0xff4444        // Vermelho
};

// Tamanhos de tiles
export const TILE = {
  SIZE: 32,
  SCALE: 2
};
