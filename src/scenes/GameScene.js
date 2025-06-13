export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'https://examples.phaser.io/assets/sprites/phaser-dude.png');
  }

  create() {
    // Tamanho do mapa ou mundo
    this.mapWidth = 1920;
    this.mapHeight = 1080;

    // Cria o player no centro do mapa
    this.player = this.physics.add.sprite(this.mapWidth / 2, this.mapHeight / 2, 'player');
    this.player.setCollideWorldBounds(true);

    // Configura f�sica arcade (sem gravidade)
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    // Configura c�mera
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.mapWidth, this.mapHeight);
    cam.centerOn(this.mapWidth / 2, this.mapHeight / 2);
    cam.setZoom(1);
    cam.startFollow(this.player, true, 0.1, 0.1);

    // Configura controles cursor
    this.cursors = this.input.keyboard.createCursorKeys();

    // Ouve evento resize do Phaser para redimensionar c�mera
    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    if (!gameSize) return;

    const width = gameSize.width;
    const height = gameSize.height;
    const cam = this.cameras.main;

    // Ajusta tamanho da c�mera para o tamanho atual da tela
    cam.setSize(width, height);

    // Calcula zoom para encaixar o mapa inteiro sem distorcer
    const zoomX = width / this.mapWidth;
    const zoomY = height / this.mapHeight;
    const zoom = Math.min(zoomX, zoomY);

    cam.setZoom(zoom);

    // Centraliza c�mera no meio do mapa (ou no player)
    // Se quiser seguir o player, pode comentar a linha abaixo
    cam.centerOn(this.mapWidth / 2, this.mapHeight / 2);
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    }
  }
}
