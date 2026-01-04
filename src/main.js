import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';

// Inicializa o jogo quando o DOM estiver pronto
window.addEventListener('load', () => {
  const game = new Phaser.Game(gameConfig);

  // Previne comportamentos padrão do navegador em mobile
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('#game-container')) {
      e.preventDefault();
    }
  }, { passive: false });
});
