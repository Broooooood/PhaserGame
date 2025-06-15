//src/map/Generator.js
export default class MapGenerator {
  constructor(scene, tileSize) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.tiles = new Map();
    this.stones = new Map();
    this.stonesData = {
      1: { width: 10, height: 9 },
      2: { width: 9, height: 7 },
      3: { width: 6, height: 5 },
      4: { width: 4, height: 3 },
      5: { width: 9, height: 8 },
      6: { width: 11, height: 9 }
    };
  }

  simpleHash(x, y) {
    // fun��o simples para gerar n�mero inteiro
    return Math.abs((x * 73856093) ^ (y * 19349663)) % 100000;
  }

  update(playerX, playerY) {
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    const tilesHorizontais = Math.ceil(screenWidth / this.tileSize);
    const tilesVerticais = Math.ceil(screenHeight / this.tileSize);

    const tileRangeX = Math.ceil(tilesHorizontais / 2) + 2;
    const tileRangeY = Math.ceil(tilesVerticais / 2) + 2;

    const playerTileX = Math.floor(playerX / this.tileSize);
    const playerTileY = Math.floor(playerY / this.tileSize);

    const newTiles = new Map();
    const newStones = new Map();

    for (let y = -tileRangeY; y <= tileRangeY; y++) {
      for (let x = -tileRangeX; x <= tileRangeX; x++) {
        const tx = playerTileX + x;
        const ty = playerTileY + y;
        const key = `${tx}_${ty}`;

        // Tiles ch�o
        if (!this.tiles.has(key)) {
          const index = Phaser.Math.Between(1, 64).toString().padStart(2, '0');
          const tile = this.scene.add.image(
            tx * this.tileSize + this.tileSize / 2,
            ty * this.tileSize + this.tileSize / 2,
            `tile_${index}`
          );
          tile.setDepth(-100);
          newTiles.set(key, tile);
        } else {
          newTiles.set(key, this.tiles.get(key));
        }

        // Pedra chance fixa
        const hash = this.simpleHash(tx, ty);
        const chance = hash % 100;

        if (chance < 10) { // Aumentei para 10% pra testar
          if (!this.stones.has(key)) {
            const stoneIndex = (hash % 6) + 1;
            const stoneData = this.stonesData[stoneIndex];

            // Corrigindo offset para n�o passar do tile
            const maxOffsetX = this.tileSize - stoneData.width;
            const maxOffsetY = this.tileSize - stoneData.height;

            const offsetX = (hash * 3) % maxOffsetX;
            const offsetY = (hash * 7) % maxOffsetY;

            const stoneX = tx * this.tileSize + offsetX + stoneData.width / 2;
            const stoneY = ty * this.tileSize + offsetY + stoneData.height / 2;

            // Debug
            // console.log(`Gerando pedra ${stoneIndex} no tile ${key} em x:${stoneX}, y:${stoneY}`);

            const stone = this.scene.add.image(stoneX, stoneY, `stone_${stoneIndex}`);
            stone.setDepth(-50);
            newStones.set(key, stone);
          } else {
            newStones.set(key, this.stones.get(key));
          }
        } else {
          if (this.stones.has(key)) {
            this.stones.get(key).destroy();
          }
        }
      }
    }

    // Remove antigos fora do alcance
    this.tiles.forEach((tile, key) => {
      if (!newTiles.has(key)) tile.destroy();
    });
    this.stones.forEach((stone, key) => {
      if (!newStones.has(key)) stone.destroy();
    });

    this.tiles = newTiles;
    this.stones = newStones;
  }
}
