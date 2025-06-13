import Player from '../characters/Player.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.spritesheet('player_run', 'src/assets/player/Run.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_idle', 'src/assets/player/Idle.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_walk', 'src/assets/player/Walk.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    this.mapWidth = 1920;
    this.mapHeight = 1080;

    this.player = new Player(this, this.mapWidth / 2, this.mapHeight / 2);

    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.mapWidth, this.mapHeight);
    cam.startFollow(this.player, true, 0.1, 0.1);

    this.adjustCameraZoom();

    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    if (!gameSize) return;
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.adjustCameraZoom();
  }

  adjustCameraZoom() {
    const width = this.scale.width;
    const height = this.scale.height;

    const zoomX = width / this.mapWidth;
    const zoomY = height / this.mapHeight;
    const zoom = Math.min(zoomX, zoomY);

    this.cameras.main.setZoom(zoom);
  }

  update() {
    this.player.update();
  }
}
