import Phaser from 'phaser';
import Generator from '../map/Generator.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.MAP_WIDTH = 50;
    this.MAP_HEIGHT = 50;
    this.TILE_SIZE = 16;
  }

  preload() {
    this.load.image('tiles', 'assets/tileSet/walls_floor.png');
  }

  create() {
    const gen = new Generator(this.MAP_WIDTH, this.MAP_HEIGHT);
    const mapData = gen.generateDungeonMap(8, 5, 12);

    const map = this.make.tilemap({
      data: mapData,
      tileWidth: this.TILE_SIZE,
      tileHeight: this.TILE_SIZE,
    });

    const tileset = map.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);
    const layer = map.createLayer(0, tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.scale.on('resize', (gameSize) => {
      this.cameras.resize(gameSize.width, gameSize.height);
    });
  }
}

export default GameScene;
