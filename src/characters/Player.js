export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.speed = 150;
    this.runSpeed = 250;
    

    this.isAttacking = false;
    this.attackCombo = 0;
    this.attackTimer = 0;
    this.comboResetTime = 100; // Tempo para resetar combo (ms)

    this.createAnimations(scene);

    this.anims.play('idle');
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
        frames: scene.anims.generateFrameNumbers('player_attak1', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }

    if (!scene.anims.exists('attack2')) {
      scene.anims.create({
        key: 'attack2',
        frames: scene.anims.generateFrameNumbers('player_attak2', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }

    if (!scene.anims.exists('attack3')) {
      scene.anims.create({
        key: 'attack3',
        frames: scene.anims.generateFrameNumbers('player_attak3', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }

    if (!scene.anims.exists('attackRun')) {
      scene.anims.create({
        key: 'attackRun',
        frames: scene.anims.generateFrameNumbers('player_attakRun', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }

  }

  update(time) {
    // Ataque
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.handleAttack(time);
      return;
    }

    if (this.isAttacking) return;

    // Movimento
    const isRunning = this.shiftKey.isDown;
    const velocity = isRunning ? this.runSpeed : this.speed;

    let moving = false;

    this.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.setVelocityX(-velocity);
      this.setFlipX(true);
      moving = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(velocity);
      this.setFlipX(false);
      moving = true;
    }

    if (this.cursors.up.isDown) {
      this.setVelocityY(-velocity);
      moving = true;
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(velocity);
      moving = true;
    }

    if (moving) {
      this.anims.play(isRunning ? 'run' : 'walk', true);
    } else {
      this.anims.play('idle', true);
    }
  }

handleAttack(time) {
  if (this.isAttacking) return;

  this.isAttacking = true;

  const isRunning = this.shiftKey.isDown;

  // Se estiver correndo, usa a animação de ataque especial
  if (isRunning) {
    this.anims.play('attackRun', true);

    this.attackCombo = 0; // Não entra no combo normal

    this.once('animationcomplete', () => {
      this.isAttacking = false;
    });

    return;
  }

  // Ataque em sequência normal (combo)
  this.attackCombo++;
  if (this.attackCombo > 3) this.attackCombo = 1;

  const animKey = `attack${this.attackCombo}`;
  this.anims.play(animKey, true);

  this.attackTimer = time;

  this.once('animationcomplete', () => {
    this.isAttacking = false;

    this.scene.time.delayedCall(this.comboResetTime, () => {
      if (!this.isAttacking && this.scene.time.now - this.attackTimer >= this.comboResetTime) {
        this.attackCombo = 0;
      }
    });
  });
}

}
