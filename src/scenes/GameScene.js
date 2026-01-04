import Phaser from 'phaser';
import { COLORS, PLAYER, SCORE, TILE } from '../config/constants.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.player = null;
    this.cursors = null;
    this.score = 0;
    this.lives = PLAYER.INITIAL_LIVES;
    this.isJumping = false;
    this.canMove = true;

    // Controles touch
    this.joystick = null;
    this.jumpButton = null;
    this.interactButton = null;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Cria o mundo do jogo
    this.createWorld(width, height);

    // Cria o player
    this.createPlayer();

    // Cria a HUD
    this.createHUD(width);

    // Cria controles
    this.createControls(width, height);

    // Configura colisões
    this.setupCollisions();

    // Configura a câmera para seguir o player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 50);
  }

  createWorld(width, height) {
    // Fundo
    this.cameras.main.setBackgroundColor(0x87ceeb); // Azul céu

    // Array para armazenar plataformas
    this.platformObjects = [];

    // Chão principal
    const ground = this.add.rectangle(800, height - 16, 1600, 32, COLORS.SECONDARY);
    this.physics.add.existing(ground, true);
    this.platformObjects.push(ground);

    // Plataformas flutuantes
    const platformPositions = [
      { x: 200, y: height - 100, w: 128 },
      { x: 400, y: height - 180, w: 96 },
      { x: 600, y: height - 140, w: 128 },
      { x: 850, y: height - 200, w: 96 },
      { x: 1100, y: height - 160, w: 128 },
      { x: 1350, y: height - 220, w: 96 }
    ];

    platformPositions.forEach(pos => {
      const platform = this.add.rectangle(pos.x, pos.y, pos.w, 24, COLORS.PRIMARY);
      this.physics.add.existing(platform, true);
      this.platformObjects.push(platform);
    });

    // Coletáveis
    this.collectibles = [];
    this.createCollectibles();

    // Inimigos
    this.enemies = [];
    this.createEnemies();

    // Define os limites do mundo
    this.physics.world.setBounds(0, 0, 1600, height);
    this.cameras.main.setBounds(0, 0, 1600, height);
  }

  createCollectibles() {
    const positions = [
      { x: 200, y: 300 },
      { x: 300, y: 350 },
      { x: 450, y: 250 },
      { x: 600, y: 280 },
      { x: 750, y: 350 },
      { x: 900, y: 220 },
      { x: 1050, y: 300 },
      { x: 1200, y: 260 },
      { x: 1400, y: 200 }
    ];

    positions.forEach(pos => {
      const fruit = this.add.sprite(pos.x, pos.y, 'fruit');
      fruit.setScale(2);
      this.physics.add.existing(fruit, true);
      this.collectibles.push(fruit);

      // Animação de rotação
      fruit.play('fruit_spin');

      // Animação de flutuação
      this.tweens.add({
        targets: fruit,
        y: pos.y - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  createEnemies() {
    const height = this.cameras.main.height;

    // Cria algumas cobras patrulhando
    const enemyPositions = [
      { x: 500, y: height - 48, minX: 400, maxX: 600 },
      { x: 900, y: height - 48, minX: 800, maxX: 1000 },
      { x: 1250, y: height - 48, minX: 1150, maxX: 1350 }
    ];

    enemyPositions.forEach(pos => {
      const enemy = this.add.sprite(pos.x, pos.y, 'snake');
      enemy.setScale(2);
      this.physics.add.existing(enemy);
      enemy.body.setImmovable(true);
      enemy.body.allowGravity = false;
      enemy.body.setVelocityX(50);
      enemy.body.setSize(28, 20);
      enemy.body.setOffset(2, 8);

      enemy.minX = pos.minX;
      enemy.maxX = pos.maxX;
      enemy.direction = 1;

      // Inicia animação
      enemy.play('snake_move');

      this.enemies.push(enemy);
    });
  }

  createPlayer() {
    const height = this.cameras.main.height;

    // Cria o player usando o sprite da capivara
    // Posição Y: altura - chão(32) - metade do sprite escalado(32)
    this.player = this.add.sprite(100, height - 64, 'capibara');
    this.player.setScale(2); // Escala 2x para pixel art
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(24, 28);
    this.player.body.setOffset(4, 4);

    // Inicia animação idle e orientação para direita
    this.player.play('capibara_idle');
    this.player.setFlipX(true);
  }

  createHUD(width) {
    // Container da HUD (fixo na câmera)
    this.hudContainer = this.add.container(0, 0);
    this.hudContainer.setScrollFactor(0);
    this.hudContainer.setDepth(100);

    // Vidas (corações)
    this.heartsDisplay = [];
    for (let i = 0; i < PLAYER.MAX_LIVES; i++) {
      const heartFull = this.add.image(25 + (i * 35), 25, 'heart');
      heartFull.setScale(1.5);
      heartFull.setVisible(i < this.lives);

      const heartEmpty = this.add.image(25 + (i * 35), 25, 'heart_empty');
      heartEmpty.setScale(1.5);
      heartEmpty.setVisible(i >= this.lives);

      this.heartsDisplay.push({ full: heartFull, empty: heartEmpty });
      this.hudContainer.add(heartFull);
      this.hudContainer.add(heartEmpty);
    }

    // Pontuação
    this.scoreText = this.add.text(width - 20, 20, `⭐ ${this.score}`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(1, 0);
    this.hudContainer.add(this.scoreText);

    // Nome do nível
    this.add.text(width / 2, 20, 'Nível 1: Floresta Tropical', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
  }

  createControls(width, height) {
    // Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Controles touch
    this.createTouchControls(width, height);
  }

  createTouchControls(width, height) {
    // Container para controles touch
    this.touchControls = this.add.container(0, 0);
    this.touchControls.setScrollFactor(0);
    this.touchControls.setDepth(100);
    this.touchControls.setAlpha(0.7);

    // Joystick virtual (esquerda)
    const joystickBase = this.add.circle(100, height - 80, 50, 0x000000, 0.3);
    const joystickThumb = this.add.circle(100, height - 80, 25, 0xffffff, 0.5);

    this.touchControls.add([joystickBase, joystickThumb]);

    // Estado do joystick
    this.joystickState = { x: 0, y: 0 };
    this.joystickBase = joystickBase;
    this.joystickThumb = joystickThumb;

    // Zona de toque do joystick
    const joystickZone = this.add.rectangle(100, height - 80, 150, 150, 0x000000, 0);
    joystickZone.setInteractive();
    this.touchControls.add(joystickZone);

    joystickZone.on('pointerdown', (pointer) => {
      this.updateJoystick(pointer);
    });

    joystickZone.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.updateJoystick(pointer);
      }
    });

    joystickZone.on('pointerup', () => {
      this.resetJoystick();
    });

    joystickZone.on('pointerout', () => {
      this.resetJoystick();
    });

    // Botão de pulo (A) - direita
    const jumpBtn = this.add.circle(width - 80, height - 80, 35, COLORS.PRIMARY, 0.8);
    const jumpText = this.add.text(width - 80, height - 80, 'A', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.touchControls.add([jumpBtn, jumpText]);

    jumpBtn.setInteractive();
    jumpBtn.on('pointerdown', () => {
      this.jump();
      jumpBtn.setScale(0.9);
    });
    jumpBtn.on('pointerup', () => {
      jumpBtn.setScale(1);
    });

    // Botão de interação (B) - direita superior
    const interactBtn = this.add.circle(width - 150, height - 100, 30, COLORS.SECONDARY, 0.8);
    const interactText = this.add.text(width - 150, height - 100, 'B', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.touchControls.add([interactBtn, interactText]);

    interactBtn.setInteractive();
    interactBtn.on('pointerdown', () => {
      this.interact();
      interactBtn.setScale(0.9);
    });
    interactBtn.on('pointerup', () => {
      interactBtn.setScale(1);
    });
  }

  updateJoystick(pointer) {
    const baseX = 100;
    const baseY = this.cameras.main.height - 80;
    const maxDistance = 40;

    let dx = pointer.x - baseX;
    let dy = pointer.y - baseY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    this.joystickThumb.setPosition(baseX + dx, baseY + dy);
    this.joystickState.x = dx / maxDistance;
    this.joystickState.y = dy / maxDistance;
  }

  resetJoystick() {
    const baseX = 100;
    const baseY = this.cameras.main.height - 80;
    this.joystickThumb.setPosition(baseX, baseY);
    this.joystickState.x = 0;
    this.joystickState.y = 0;
  }

  setupCollisions() {
    // Player x Plataformas
    this.platformObjects.forEach(platform => {
      this.physics.add.collider(this.player, platform);
    });

    // Inimigos x Plataformas
    this.enemies.forEach(enemy => {
      this.platformObjects.forEach(platform => {
        this.physics.add.collider(enemy, platform);
      });
    });

    // Player x Coletáveis
    this.collectibles.forEach(fruit => {
      this.physics.add.overlap(this.player, fruit, this.collectItem, null, this);
    });

    // Player x Inimigos
    this.enemies.forEach(enemy => {
      this.physics.add.overlap(this.player, enemy, this.handleEnemyCollision, null, this);
    });
  }

  collectItem(player, item) {
    item.destroy();
    this.score += SCORE.COLLECTIBLE_BASIC;
    this.updateScore();

    // Efeito visual
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 100,
      yoyo: true
    });
  }

  handleEnemyCollision(player, enemy) {
    // Verifica se o player está caindo em cima do inimigo
    if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
      // Derrota o inimigo
      this.defeatEnemy(enemy);
      // Pequeno pulo após derrotar
      player.body.setVelocityY(-200);
    } else {
      // Player toma dano
      this.takeDamage();
    }
  }

  defeatEnemy(enemy) {
    this.score += SCORE.ENEMY_DEFEAT;
    this.updateScore();

    // Animação de derrota
    this.tweens.add({
      targets: enemy,
      alpha: 0,
      y: enemy.y + 20,
      duration: 200,
      onComplete: () => enemy.destroy()
    });
  }

  takeDamage() {
    if (!this.canMove) return;

    this.lives--;
    this.updateHearts();

    if (this.lives <= 0) {
      this.gameOver();
      return;
    }

    // Invencibilidade temporária
    this.canMove = false;
    this.player.setAlpha(0.5);

    // Knockback
    const knockbackDir = this.player.body.velocity.x > 0 ? -1 : 1;
    this.player.body.setVelocity(knockbackDir * 200, -200);

    // Pisca o player
    this.tweens.add({
      targets: this.player,
      alpha: { from: 0.5, to: 1 },
      duration: 100,
      repeat: 10,
      onComplete: () => {
        this.canMove = true;
        this.player.setAlpha(1);
      }
    });
  }

  updateScore() {
    this.scoreText.setText(`⭐ ${this.score}`);
  }

  updateHearts() {
    this.heartsDisplay.forEach((heart, index) => {
      heart.full.setVisible(index < this.lives);
      heart.empty.setVisible(index >= this.lives);
    });
  }

  gameOver() {
    this.canMove = false;
    this.physics.pause();

    // Tela de Game Over
    const { width, height } = this.cameras.main;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setScrollFactor(0);
    overlay.setDepth(200);

    const gameOverText = this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const scoreText = this.add.text(width / 2, height / 2 + 10, `Pontuação: ${this.score}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const restartBtn = this.add.text(width / 2, height / 2 + 70, 'TENTAR NOVAMENTE', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#4a9c2d',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setInteractive();

    restartBtn.on('pointerup', () => {
      this.scene.restart();
    });
  }

  jump() {
    if (this.player.body.blocked.down && this.canMove) {
      this.player.body.setVelocityY(PLAYER.JUMP_VELOCITY);
    }
  }

  interact() {
    // TODO: Implementar interação com NPCs
    console.log('Interagir!');
  }

  update() {
    if (!this.canMove) return;

    // Movimento horizontal
    let velocityX = 0;

    // Teclado
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -PLAYER.SPEED;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = PLAYER.SPEED;
    }

    // Joystick touch
    if (Math.abs(this.joystickState.x) > 0.2) {
      velocityX = this.joystickState.x * PLAYER.SPEED;
    }

    this.player.body.setVelocityX(velocityX);

    // Pulo via teclado
    if ((this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown) && this.player.body.blocked.down) {
      this.jump();
    }

    // Flip do player baseado na direção
    if (velocityX < 0) {
      this.player.setFlipX(false);
    } else if (velocityX > 0) {
      this.player.setFlipX(true);
    }

    // Animações baseadas no estado
    if (!this.player.body.blocked.down) {
      // No ar - animação de pulo
      if (this.player.anims.currentAnim?.key !== 'capibara_jump') {
        this.player.play('capibara_jump');
      }
    } else if (Math.abs(velocityX) > 0) {
      // Andando
      if (this.player.anims.currentAnim?.key !== 'capibara_walk') {
        this.player.play('capibara_walk');
      }
    } else {
      // Parado
      if (this.player.anims.currentAnim?.key !== 'capibara_idle') {
        this.player.play('capibara_idle');
      }
    }

    // Atualiza inimigos (patrulha)
    this.enemies.forEach(enemy => {
      if (enemy.active && enemy.body) {
        if (enemy.x <= enemy.minX) {
          enemy.body.setVelocityX(50);
          enemy.direction = 1;
          enemy.setFlipX(false);
        } else if (enemy.x >= enemy.maxX) {
          enemy.body.setVelocityX(-50);
          enemy.direction = -1;
          enemy.setFlipX(true);
        }
      }
    });
  }
}
