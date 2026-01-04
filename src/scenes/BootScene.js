import Phaser from 'phaser';
import { COLORS, GAME } from '../config/constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Carrega assets mínimos para a tela de loading
    this.load.setPath('assets/');

    // Cria um retângulo simples para a barra de progresso
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(COLORS.PRIMARY, 1);
    graphics.fillRect(0, 0, 1, 1);
    graphics.generateTexture('pixel', 1, 1);
    graphics.destroy();
  }

  create() {
    // Configurações iniciais do jogo
    this.scale.lockOrientation('landscape');

    // Vai para a cena de preload
    this.scene.start('PreloadScene');
  }
}
