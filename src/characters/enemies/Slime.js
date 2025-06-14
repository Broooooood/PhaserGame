export default class Slime extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player, generation = 0) {
    super(scene, x, y, 'slime_S_Walk');

    this.scene = scene;
    this.player = player;
    this.generation = generation;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 60;
    this.isDead = false;

    this.setCollideWorldBounds(true);

    this.maxHealth = 50;
    this.currentHealth = 50;

    this.createAnimations();
    this.anims.play('slime_walk_side');

    this.hasSplit = false;

    // Barra de vida (verde)
    this.healthBarBackground = scene.add.rectangle(this.x, this.y - 25, 40, 5, 0x000000).setOrigin(0.5);
    this.healthBarFill = scene.add.rectangle(this.x, this.y - 25, 40, 5, 0x00ff00).setOrigin(0.5);
  }

  createAnimations() {
    if (!this.scene.anims.exists('slime_walk_side')) {
      this.scene.anims.create({
        key: 'slime_walk_side',
        frames: this.scene.anims.generateFrameNumbers('slime_S_Walk', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.scene.anims.exists('slime_walk_up')) {
      this.scene.anims.create({
        key: 'slime_walk_up',
        frames: this.scene.anims.generateFrameNumbers('slime_U_Walk', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.scene.anims.exists('slime_walk_down')) {
      this.scene.anims.create({
        key: 'slime_walk_down',
        frames: this.scene.anims.generateFrameNumbers('slime_D_Walk', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    if (!this.scene.anims.exists('slime_death')) {
      this.scene.anims.create({
        key: 'slime_death',
        frames: this.scene.anims.generateFrameNumbers('slime_S_Death', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: 0,
      });
    }
    if (!this.scene.anims.exists('slime_special')) {
      this.scene.anims.create({
        key: 'slime_special',
        frames: this.scene.anims.generateFrameNumbers('slime_S_Special', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: 0,
      });
    }
  }

  update() {
    if (this.isDead) return;

    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const vx = (dx / distance) * this.speed;
      const vy = (dy / distance) * this.speed;
      this.setVelocity(vx, vy);

      if (Math.abs(dx) > Math.abs(dy)) {
        this.anims.play('slime_walk_side', true);
        this.setFlipX(dx < 0);
      } else {
        if (dy > 0) {
          this.anims.play('slime_walk_down', true);
        } else {
          this.anims.play('slime_walk_up', true);
        }
      }
    } else {
      this.setVelocity(0);
      this.anims.stop();
    }

    // Atualiza posição da barra de vida
    const percent = this.currentHealth / this.maxHealth;
    this.healthBarFill.width = 40 * percent;
    this.healthBarBackground.setPosition(this.x, this.y - 25);
    this.healthBarFill.setPosition(this.x, this.y - 25);
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

  takeDamage(amount) {
    if (this.isDead) return;

    this.currentHealth -= amount;
    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;

    this.isDead = true;
    this.setVelocity(0);
    this.anims.play('slime_death');

    this.healthBarFill.destroy();
    this.healthBarBackground.destroy();

    this.once('animationcomplete', () => {
      if (!this.hasSplit) {
        this.hasSplit = true;
        this.split();
      }
      this.destroy();
    });
  }

split() {
  // Permitir no máximo 2 gerações: original (0) → 1 → 2
  if (this.generation >= 2) return;

  const offsets = [
    { x: 20, y: 0 },
    { x: -20, y: 0 },
    { x: 0, y: 20 },
  ];

  offsets.forEach((offset) => {
    const newX = this.x + offset.x;
    const newY = this.y + offset.y;

    const newSlime = new Slime(this.scene, newX, newY, this.player, this.generation + 1);
    this.scene.slimesGroup.add(newSlime);
  });
}
}
