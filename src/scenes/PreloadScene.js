import Phaser from 'phaser';
import { COLORS, GAME } from '../config/constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.createLoadingScreen();
    this.loadAssets();
  }

  createLoadingScreen() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // Título
    this.add.text(width / 2, height / 2 - 80, GAME.TITLE, {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Barra de progresso - fundo
    const barWidth = 300;
    const barHeight = 20;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2;

    this.add.rectangle(width / 2, barY, barWidth + 4, barHeight + 4, 0x444444);

    // Barra de progresso - preenchimento
    const progressBar = this.add.rectangle(barX + 2, barY, 0, barHeight - 4, COLORS.PRIMARY);
    progressBar.setOrigin(0, 0.5);

    // Texto de carregamento
    const loadingText = this.add.text(width / 2, barY + 40, 'Carregando...', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    // Atualiza a barra de progresso
    this.load.on('progress', (value) => {
      progressBar.width = (barWidth - 4) * value;
    });

    this.load.on('fileprogress', (file) => {
      loadingText.setText(`Carregando: ${file.key}`);
    });

    this.load.on('complete', () => {
      loadingText.setText('Pronto!');
    });
  }

  loadAssets() {
    this.load.setPath('assets/');

    // Sprites da capivara
    this.load.spritesheet('capibara', 'sprites/capibara/capibara.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // Tiles do cenário
    this.load.image('tiles_floresta', 'sprites/tiles/floresta.png');

    // UI
    this.load.image('btn_play', 'ui/buttons/play.png');
    this.load.image('btn_customize', 'ui/buttons/customize.png');
    this.load.image('joystick_base', 'ui/hud/joystick_base.png');
    this.load.image('joystick_thumb', 'ui/hud/joystick_thumb.png');
    this.load.image('btn_a', 'ui/hud/btn_a.png');
    this.load.image('btn_b', 'ui/hud/btn_b.png');
    this.load.image('heart', 'ui/hud/heart.png');
    this.load.image('heart_empty', 'ui/hud/heart_empty.png');

    // Coletáveis
    this.load.spritesheet('fruit', 'sprites/items/fruit.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // Inimigos
    this.load.spritesheet('snake', 'sprites/enemies/snake.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.createAnimations();
    this.scene.start('MenuScene');
  }

  createAnimations() {
    // Animações da capivara
    this.anims.create({
      key: 'capibara_idle',
      frames: this.anims.generateFrameNumbers('capibara', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'capibara_walk',
      frames: this.anims.generateFrameNumbers('capibara', { start: 2, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'capibara_jump',
      frames: this.anims.generateFrameNumbers('capibara', { start: 6, end: 7 }),
      frameRate: 4,
      repeat: 0
    });

    this.anims.create({
      key: 'capibara_swim',
      frames: this.anims.generateFrameNumbers('capibara', { start: 8, end: 11 }),
      frameRate: 6,
      repeat: -1
    });

    // Animações dos coletáveis
    this.anims.create({
      key: 'fruit_spin',
      frames: this.anims.generateFrameNumbers('fruit', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // Animações da cobra
    this.anims.create({
      key: 'snake_move',
      frames: this.anims.generateFrameNumbers('snake', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });
  }
}
