// src/characters/enemies/Goblin.js

import Enemy from './Enemy.js';

export default class Goblin extends Enemy {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'goblin_S_Walk', player);

    this.speed = 90;
    this.maxHealth = 70;
    this.currentHealth = 70;
    this.attackRange = 30;      // Definir um alcance de ataque para o goblin
    this.attackCooldown = 1000; // Cooldown do ataque
    this.lastAttackTime = 0;

    this.createAnimations();
    this.anims.play('goblin_walk_side');
  }

  createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists('goblin_walk_side')) {
      anims.create({
        key: 'goblin_walk_side',
        frames: anims.generateFrameNumbers('goblin_S_Walk', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!anims.exists('goblin_walk_up')) {
      anims.create({
        key: 'goblin_walk_up',
        frames: anims.generateFrameNumbers('goblin_U_Walk', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!anims.exists('goblin_walk_down')) {
      anims.create({
        key: 'goblin_walk_down',
        frames: anims.generateFrameNumbers('goblin_D_Walk', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!anims.exists('goblin_attack_side')) {
      anims.create({
        key: 'goblin_attack_side',
        frames: anims.generateFrameNumbers('goblin_S_Attack', { start: 0, end: 3 }), // Use frames reais de ataque se tiver
        frameRate: 10,
        repeat: 0,
      });
    }

    if (!anims.exists('goblin_death_side')) {
        anims.create({
            key: 'goblin_death_side',
            frames: anims.generateFrameNumbers('goblin_S_Death', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: 0,
        });
    }

    if (!anims.exists('goblin_death_up')) {
    anims.create({
        key: 'goblin_death_up',
        frames: anims.generateFrameNumbers('goblin_U_Death', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0,
    });
    }

    if (!anims.exists('goblin_death_down')) {
    anims.create({
        key: 'goblin_death_down',
        frames: anims.generateFrameNumbers('goblin_D_Death', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0,
    });
    }
  }

  die() {
  this.isDead = true;
  this.setVelocity(0);

  // Escolhe animação de morte com base na direção do último movimento
  let deathAnimKey = 'goblin_death_side'; // default

  const dx = this.player.x - this.x;
  const dy = this.player.y - this.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    deathAnimKey = 'goblin_death_side';
    this.setFlipX(dx < 0);
  } else {
    deathAnimKey = dy > 0 ? 'goblin_death_down' : 'goblin_death_up';
  }

  this.anims.play(deathAnimKey, true);
  this.once('animationcomplete', () => {
    this.destroy();
  });
}


  update(time, delta) {
    if (this.isDead) return;

    super.update(time, delta);

    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.attackRange) {
      this.setVelocity(0);

      if (time > this.lastAttackTime + this.attackCooldown) {
        this.lastAttackTime = time;

        this.anims.play('goblin_attack_side', true);
      }
      this.setFlipX(dx > 0);
    } else if (Math.abs(dx) > Math.abs(dy)) {
      if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('goblin_walk_side')) {
        this.anims.play('goblin_walk_side', true);
      }
      this.setFlipX(dx > 0);
      this.setVelocity(dx > 0 ? this.speed : -this.speed, 0);
    } else {
      if (dy > 0) {
        if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('goblin_walk_down')) {
          this.anims.play('goblin_walk_down', true);
        }
        this.setVelocity(0, this.speed);
      } else {
        if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('goblin_walk_up')) {
          this.anims.play('goblin_walk_up', true);
        }
        this.setVelocity(0, -this.speed);
      }
    }
  }
}
