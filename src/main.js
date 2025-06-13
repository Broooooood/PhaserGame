function GameScene() {
  Phaser.Scene.call(this, { key: 'GameScene' });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.preload = function () {
  this.load.image('tiles', 'assets/tileSet/walls_floor.png');
};

GameScene.prototype.create = function () {
  this.add.text(100, 100, 'Jogo carregado com sucesso!', { fontSize: '20px', fill: '#fff' });
};

// Configura��o do Phaser
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#000',
  scene: [GameScene]
};

const game = new Phaser.Game(config);