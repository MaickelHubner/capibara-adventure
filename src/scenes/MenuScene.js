import Phaser from 'phaser';
import { COLORS, GAME } from '../config/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // Fundo decorativo (gradiente simulado)
    this.createBackground(width, height);

    // Título do jogo
    this.createTitle(width);

    // Botões do menu
    this.createMenuButtons(width, height);

    // Versão
    this.add.text(width - 10, height - 10, `v${GAME.VERSION}`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#666666'
    }).setOrigin(1, 1);
  }

  createBackground(width, height) {
    // Cria um fundo com elementos decorativos
    const graphics = this.add.graphics();

    // Gradiente de fundo (simulado com retângulos)
    for (let i = 0; i < 10; i++) {
      const alpha = 0.05 - (i * 0.005);
      graphics.fillStyle(COLORS.PRIMARY, alpha);
      graphics.fillRect(0, height - (i * 50), width, 50);
    }

    // Alguns círculos decorativos
    graphics.fillStyle(0xffffff, 0.02);
    graphics.fillCircle(100, 100, 80);
    graphics.fillCircle(width - 80, 150, 60);
    graphics.fillCircle(200, height - 100, 40);
  }

  createTitle(width) {
    // Sombra do título
    this.add.text(width / 2 + 3, 83, GAME.TITLE, {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0.3);

    // Título principal
    const title = this.add.text(width / 2, 80, GAME.TITLE, {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Animação do título
    this.tweens.add({
      targets: title,
      y: 85,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtítulo
    this.add.text(width / 2, 130, 'Uma aventura brasileira!', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
  }

  createMenuButtons(width, height) {
    const buttonStyle = {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4a9c2d',
      padding: { x: 30, y: 15 }
    };

    // Botão Jogar
    const playButton = this.createButton(
      width / 2,
      height / 2 + 20,
      'JOGAR',
      buttonStyle,
      () => this.startGame()
    );

    // Botão Personalizar
    const customizeButton = this.createButton(
      width / 2,
      height / 2 + 90,
      'PERSONALIZAR',
      { ...buttonStyle, fontSize: '18px', backgroundColor: '#8b4513' },
      () => this.openCustomize()
    );
  }

  createButton(x, y, text, style, callback) {
    const button = this.add.text(x, y, text, style)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Efeitos de hover/touch
    button.on('pointerover', () => {
      button.setScale(1.1);
    });

    button.on('pointerout', () => {
      button.setScale(1);
    });

    button.on('pointerdown', () => {
      button.setScale(0.95);
    });

    button.on('pointerup', () => {
      button.setScale(1);
      callback();
    });

    return button;
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  openCustomize() {
    // TODO: Implementar tela de personalização
    console.log('Personalização em breve!');
  }
}
