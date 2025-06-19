// src/characters/enemies/Wolf.js

import Enemy from './Enemy.js';

export default class Wolf extends Enemy {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'wolf_S_Walk', player);

    this.speed = 120;
    this.maxHealth = 70;
    this.currentHealth = this.maxHealth;
    this.attackRange = 40;
    this.attackCooldown = 800;
    this.lastAttackTime = 0; // Controle do cooldown

    this.createAnimations();
    this.anims.play('wolf_walk_side');
  }

  createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists('wolf_walk_side')) {
      anims.create({
        key: 'wolf_walk_side',
        frames: anims.generateFrameNumbers('wolf_S_Walk', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists('wolf_walk_up')) {
      anims.create({
        key: 'wolf_walk_up',
        frames: anims.generateFrameNumbers('wolf_U_Walk', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists('wolf_walk_down')) {
      anims.create({
        key: 'wolf_walk_down',
        frames: anims.generateFrameNumbers('wolf_D_Walk', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists('wolf_attack_side')) {
      anims.create({
        key: 'wolf_attack_side',
        frames: anims.generateFrameNumbers('wolf_S_Attack', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0,
      });
    }
    if (!anims.exists('wolf_attack_up')) {
      anims.create({
        key: 'wolf_attack_up',
        frames: anims.generateFrameNumbers('wolf_U_Attack', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0,
      });
    }
    if (!anims.exists('wolf_attack_down')) {
      anims.create({
        key: 'wolf_attack_down',
        frames: anims.generateFrameNumbers('wolf_D_Attack', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0,
      });
    }

    if (!anims.exists('wolf_death_side')) {
      anims.create({
        key: 'wolf_death_side',
        frames: anims.generateFrameNumbers('wolf_S_Death', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0,
      });
    }
    if (!anims.exists('wolf_death_up')) {
      anims.create({
        key: 'wolf_death_up',
        frames: anims.generateFrameNumbers('wolf_U_Death', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0,
      });
    }
    if (!anims.exists('wolf_death_down')) {
      anims.create({
        key: 'wolf_death_down',
        frames: anims.generateFrameNumbers('wolf_D_Death', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0,
      });
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.setVelocity(0);

    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;

    let deathAnimKey = 'wolf_death_side';

    if (Math.abs(dx) < Math.abs(dy)) {
      deathAnimKey = dy > 0 ? 'wolf_death_down' : 'wolf_death_up';
    }

    this.setFlipX(dx < 0);
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

        let attackAnimKey = 'wolf_attack_side';
        if (Math.abs(dx) < Math.abs(dy)) {
          attackAnimKey = dy > 0 ? 'wolf_attack_down' : 'wolf_attack_up';
        }

        this.anims.play(attackAnimKey, true);
      }
      this.setFlipX(dx > 0);
    } else if (Math.abs(dx) > Math.abs(dy)) {
      if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('wolf_walk_side')) {
        this.anims.play('wolf_walk_side', true);
      }
      this.setFlipX(dx > 0);
      this.setVelocity(dx > 0 ? this.speed : -this.speed, 0);
    } else {
      if (dy > 0) {
        if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('wolf_walk_down')) {
          this.anims.play('wolf_walk_down', true);
        }
        this.setVelocity(0, this.speed);
      } else {
        if (!this.anims.isPlaying || !this.anims.currentAnim.key.startsWith('wolf_walk_up')) {
          this.anims.play('wolf_walk_up', true);
        }
        this.setVelocity(0, -this.speed);
      }
    }
  }
}
