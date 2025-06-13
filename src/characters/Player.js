export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(1);

    this.scene = scene;
    this.walkSpeed = 200;
    this.runSpeed = 350;

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNumbers('player_run', { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1,
    });
  }

  update() {
    const { left, right, up, down } = this.cursors;
    let moving = false;

    let speed = this.cursors.shift?.isDown ? this.runSpeed : this.walkSpeed;

    this.setVelocity(0);

    if (left.isDown) {
    this.setVelocityX(-speed);
    this.flipX = true;
    moving = true;
    } else if (right.isDown) {
    this.setVelocityX(speed);
    this.flipX = false;
    moving = true;
    }

    if (up.isDown) {
    this.setVelocityY(-speed);
    moving = true;
    } else if (down.isDown) {
    this.setVelocityY(speed);
    moving = true;
    }

    if (moving) {
        if (this.cursors.shift.isDown) {
            this.play('run', true);
        } else {
            this.play('walk', true);
        }
    } else {
    this.play('idle', true);
    }


  }
}
