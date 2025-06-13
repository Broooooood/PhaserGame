export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'https://examples.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) this.player.setVelocityX(-200);
    else if (this.cursors.right.isDown) this.player.setVelocityX(200);

    if (this.cursors.up.isDown) this.player.setVelocityY(-200);
    else if (this.cursors.down.isDown) this.player.setVelocityY(200);
  }
}