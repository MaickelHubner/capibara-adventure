import Phaser from 'phaser';
import BootScene from '../scenes/BootScene.js';
import PreloadScene from '../scenes/PreloadScene.js';
import MenuScene from '../scenes/MenuScene.js';
import GameScene from '../scenes/GameScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 480,
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: '100%',
    height: '100%'
  },
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  input: {
    activePointers: 4,
    touch: {
      capture: true
    }
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene]
};
