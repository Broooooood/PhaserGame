// src/characters/enemies/Bee.js

import Enemy from './Enemy.js';

export default class Bee extends Enemy {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'bee_S_Walk', player); // inicia com 'side' walk

    this.speed = 60;
    this.maxHealth = 30;
    this.currentHealth = 30;

    this.orbitRadius = 50;
    this.orbitSpeed = 0.02;
    this.orbitAngle = 0;

    this.createAnimations();
    this.anims.play('bee_fly_side');
  }

  createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists('bee_fly_side') && this.scene.textures.exists('bee_S_Walk')) {
      anims.create({
        key: 'bee_fly_side',
        frames: anims.generateFrameNumbers('bee_S_Walk'), // usa todos frames disponíveis
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!anims.exists('bee_fly_up') && this.scene.textures.exists('bee_U_Walk')) {
      anims.create({
        key: 'bee_fly_up',
        frames: anims.generateFrameNumbers('bee_U_Walk'),
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!anims.exists('bee_fly_down') && this.scene.textures.exists('bee_D_Walk')) {
      anims.create({
        key: 'bee_fly_down',
        frames: anims.generateFrameNumbers('bee_D_Walk'),
        frameRate: 12,
        repeat: -1,
      });
    }
  }

  update() {
    this.orbitAngle += this.orbitSpeed;

    const centerX = this.player.x;
    const centerY = this.player.y;

    this.x = centerX + Math.cos(this.orbitAngle) * this.orbitRadius;
    this.y = centerY + Math.sin(this.orbitAngle) * this.orbitRadius;

    const angleDeg = (Phaser.Math.RadToDeg(this.orbitAngle) + 360) % 360; // normaliza o ângulo para 0-360

    if (angleDeg > 45 && angleDeg <= 135) {
      this.anims.play('bee_fly_down', true);
      this.setFlipX(false);
    } else if (angleDeg > 135 && angleDeg <= 225) {
      this.anims.play('bee_fly_side', true);
      this.setFlipX(true);
    } else if (angleDeg > 225 && angleDeg <= 315) {
      this.anims.play('bee_fly_up', true);
      this.setFlipX(false);
    } else {
      this.anims.play('bee_fly_side', true);
      this.setFlipX(false);
    }

    this.updateHealthBar();
  }
}

