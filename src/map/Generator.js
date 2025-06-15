export default class Generator {
  constructor(scene, width, height, tileSize) {
    this.scene = scene;
    this.width = width; // largura em tiles
    this.height = height; // altura em tiles
    this.tileSize = tileSize; // tamanho do tile em pixels
    this.tiles = [];
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Exemplo simples: criar chão em y = altura - 1 e blocos aleatórios em outros lugares
        if (y === this.height - 1 || Math.random() < 0.1) {
          const tile = this.scene.add.rectangle(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2,
            this.tileSize,
            this.tileSize,
            0x654321
          );
          this.scene.physics.add.existing(tile, true); // corpo estático (true)
          this.tiles.push(tile);
        }
      }
    }
  }

  getTilesGroup() {
    return this.scene.physics.add.staticGroup(this.tiles);
  }
}
