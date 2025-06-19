//src/player/Player.js

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemiesGroup) {
    super(scene, x, y, 'player_idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemiesGroup = enemiesGroup;

    this.setOrigin(0.5, 0.5);
    this.body.setSize(this.width * 0.5, this.height * 0.7);
    this.body.setOffset(this.width * 0.15, this.height * 0.4);
    this.setCollideWorldBounds(true);

    this.maxHealth = 500;
    this.currentHealth = this.maxHealth;

    this.debugGraphics = scene.add.graphics();

    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.attackButton = scene.input.activePointer;

    this.speed = 200;
    this.runSpeed = this.speed + 150;
    this.attackMoveSpeed = 50;

    this.isAttacking = false;
    this.attackCombo = 0;
    this.attackTimer = 0;
    this.comboResetTime = 600;

    this.createAnimations(scene);
    this.anims.play('idle');

    this.attackHitbox = scene.add.rectangle(0, 0, 60, 80, 0xff0000, 0.3);
    scene.physics.add.existing(this.attackHitbox);
    this.attackHitboxBody = this.attackHitbox.body;
    this.attackHitboxBody.setAllowGravity(false);
    this.attackHitboxBody.setEnable(false);

    this.healthBarBackground = scene.add.rectangle(0, 0, 128, 10, 0x000000).setOrigin(0.5);
    this.healthBarFill = scene.add.rectangle(0, 0, 128, 10, 0xff0000).setOrigin(0, 0.5);
  }

  createAnimations(scene) {
    if (!scene.anims.exists('idle')) {
      scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!scene.anims.exists('walk')) {
      scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!scene.anims.exists('run')) {
      scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNumbers('player_run', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1
      });
    }
    if (!scene.anims.exists('attack1')) {
      scene.anims.create({
        key: 'attack1',
        frames: scene.anims.generateFrameNumbers('player_attack1', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!scene.anims.exists('attack2')) {
      scene.anims.create({
        key: 'attack2',
        frames: scene.anims.generateFrameNumbers('player_attack2', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!scene.anims.exists('attack3')) {
      scene.anims.create({
        key: 'attack3',
        frames: scene.anims.generateFrameNumbers('player_attack3', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }
    if (!scene.anims.exists('attackRun')) {
      scene.anims.create({
        key: 'attackRun',
        frames: scene.anims.generateFrameNumbers('player_attackRun', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }
  }

  update(time) {
    this.healthBarBackground.x = this.x;
    this.healthBarBackground.y = this.y - 80;
    this.healthBarFill.x = this.x - 64;
    this.healthBarFill.y = this.y - 80;
    const healthPercent = Phaser.Math.Clamp(this.currentHealth / this.maxHealth, 0, 1);
    this.healthBarFill.width = 128 * healthPercent;

    if (this.attackButton.isDown && !this.isAttacking) {
      this.handleAttack(time);
      return;
    }

    const isRunning = this.shiftKey.isDown && !this.isAttacking;
    let velocity = this.speed;

    if (this.isAttacking) {
      velocity = this.attackMoveSpeed;
    } else if (isRunning) {
      velocity = this.runSpeed;
    }

    if (this.flipX) {
      this.body.setOffset(50, this.height * 0.4);
    } else {
      this.body.setOffset(5, this.height * 0.4);
    }

    let moving = false;
    this.setVelocity(0);

    if (this.keyA.isDown) {
      this.setVelocityX(-velocity);
      this.flipX = true;
      moving = true;
    } else if (this.keyD.isDown) {
      this.setVelocityX(velocity);
      this.flipX = false;
      moving = true;
    }

    if (this.keyW.isDown) {
      this.setVelocityY(-velocity);
      moving = true;
    } else if (this.keyS.isDown) {
      this.setVelocityY(velocity);
      moving = true;
    }

    if (!this.isAttacking) {
      if (!this.body.velocity.x && !this.body.velocity.y) {
        if (this.scene.time.now - this.attackTimer > this.comboResetTime) {
          this.attackCombo = 0;
        }
      }

      if (moving) {
        this.anims.play(isRunning ? 'run' : 'walk', true);
      } else {
        this.anims.play('idle', true);
      }
    }

    this.checkAttackHitboxCollision();

    this.debugGraphics.clear();
    this.debugGraphics.lineStyle(1, 0x00ff00);
    this.debugGraphics.strokeRect(this.body.x, this.body.y, this.body.width, this.body.height);
    this.debugGraphics.lineStyle(1, 0xff0000);
    this.debugGraphics.strokeRect(
      this.attackHitbox.x - this.attackHitbox.width / 2,
      this.attackHitbox.y - this.attackHitbox.height / 2,
      this.attackHitbox.width,
      this.attackHitbox.height
    );
  }

  takeDamage(amount) {
    this.currentHealth -= amount;
    if (this.currentHealth < 0) this.currentHealth = 0;
  }

  checkAttackHitboxCollision() {
    if (!this.isAttacking || !this.attackHitboxBody.enable) return;

    this.enemiesGroup.getChildren().forEach(enemy => {
      if (!enemy.isDead && Phaser.Geom.Intersects.RectangleToRectangle(this.attackHitbox.getBounds(), enemy.getBounds())) {
        enemy.takeDamage(10);
      }
    });
  }

  handleAttack(time) {
    if (this.isAttacking) return;

    const isRunning = this.shiftKey.isDown;

    if (isRunning) {
      this.isAttacking = true;
      this.anims.play('attackRun', true);
      this.attackTimer = time;
      this.attackCombo = 0;
      this.setVelocity(0);

      const offsetX = this.flipX ? -40 : 40;
      const offsetY = 20;
      this.attackHitbox.setPosition(this.x + offsetX, this.y + offsetY);
      this.attackHitboxBody.setEnable(true);

      this.scene.time.delayedCall(200, () => {
        this.attackHitboxBody.setEnable(false);
      });

      this.once('animationcomplete', () => {
        this.isAttacking = false;
        this.attackHitboxBody.setEnable(false);
        this.attackTimer = this.scene.time.now;
        if (this.attackButton.isDown) {
          this.handleAttack(this.scene.time.now);
        }
      });

      return;
    }

    this.isAttacking = true;
    this.attackCombo++;
    if (this.attackCombo > 3) this.attackCombo = 1;

    const animKey = `attack${this.attackCombo}`;
    this.anims.play(animKey, true);
    this.attackTimer = time;

    this.setVelocity(0);
    const offsetX = this.flipX ? -40 : 40;
    const offsetY = 20;
    this.attackHitbox.setPosition(this.x + offsetX, this.y + offsetY);
    this.attackHitboxBody.setEnable(true);

    this.scene.time.delayedCall(200, () => {
      this.attackHitboxBody.setEnable(false);
    });

    this.once('animationcomplete', () => {
      this.isAttacking = false;
      this.attackHitboxBody.setEnable(false);
      this.attackTimer = this.scene.time.now;
      this.attackCombo = 0;
      this.setVelocity(0);

      if (this.attackButton.isDown) {
        this.handleAttack(this.scene.time.now);
      }
    });
  }
}
