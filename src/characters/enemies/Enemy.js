// src/characters/enemies/Enemy.js (atualize com isso)
// src/characters/enemies/Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, player) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.player = player;

    // Add to scene and enable physics body
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.speed = 50;
    this.visionRange = 150;

    this.maxHealth = 50;
    this.currentHealth = this.maxHealth;
    this.isDead = false;

    // Basic setup for physics body size and offset if needed
    this.setCollideWorldBounds(true);

    // Create a health bar or health UI (optional here)
    this.healthBarBackground = this.scene.add.rectangle(0, 0, 40, 5, 0x000000).setOrigin(0.5);
    this.healthBarFill = this.scene.add.rectangle(0, 0, 40, 5, 0xff0000).setOrigin(0.5);

    // Group health bars with enemy for easier updates
    this.scene.events.on('update', this.updateHealthBar, this);
  }

  update(time, delta) {
    if (this.isDead) {
      this.setVelocity(0);
      return;
    }

    // Calculate distance to player
    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If player is within vision range, move towards player
    if (distance < this.visionRange) {
      const angle = Math.atan2(dy, dx);
      this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    } else {
      this.setVelocity(0);
    }

    // Update health bar position
    this.updateHealthBar();
  }

  updateHealthBar() {
    if (this.isDead) {
      this.healthBarBackground.setVisible(false);
      this.healthBarFill.setVisible(false);
      return;
    }

    // Position health bar above enemy
    this.healthBarBackground.setPosition(this.x, this.y - this.height / 2 - 10);
    this.healthBarFill.setPosition(this.x - (this.healthBarBackground.width / 2) * (1 - this.currentHealth / this.maxHealth), this.y - this.height / 2 - 10);

    // Adjust fill width proportionally
    this.healthBarFill.width = this.healthBarBackground.width * (this.currentHealth / this.maxHealth);

    this.healthBarBackground.setVisible(true);
    this.healthBarFill.setVisible(true);
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.currentHealth -= amount;
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0);

    // Hide enemy sprite and health bar
    this.setVisible(false);
    this.healthBarBackground.setVisible(false);
    this.healthBarFill.setVisible(false);

    // Disable physics body
    this.body.enable = false;

    // Optional: you could play death animation, spawn loot, etc.
  }

 dealDamage(player) {
    if (!player.isInvincible) {
      player.currentHealth -= 10;
      player.isInvincible = true;

      this.scene.time.delayedCall(1000, () => {
        player.isInvincible = false;
      });
    }
  }
}
