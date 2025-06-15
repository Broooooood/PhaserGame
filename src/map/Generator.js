//src/map/Generator.js
export default class MapGenerator {
  constructor(scene, tileSize) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.tiles = new Map();
    this.stones = new Map();
    this.waterTiles = new Map(); // Adicionado
    this.chunkSize = 32; // Chunk de 32x32 tiles

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
    return Math.abs((x * 73856093) ^ (y * 19349663)) % 100000;
  }

  getLakeCentersAround(tileX, tileY) {
    const chunkX = Math.floor(tileX / this.chunkSize);
    const chunkY = Math.floor(tileY / this.chunkSize);

    const centers = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = chunkX + dx;
        const cy = chunkY + dy;

        const hash = this.simpleHash(cx, cy);
        const hasLake = hash % 4 === 0; // 25% chance de ter lago

        if (hasLake) {
          const offsetX = hash % this.chunkSize;
          const offsetY = (hash >> 3) % this.chunkSize;
          const lakeX = cx * this.chunkSize + offsetX;
          const lakeY = cy * this.chunkSize + offsetY;
          centers.push({ x: lakeX, y: lakeY });
        }
      }
    }

    return centers;
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

    const lakeCenters = this.getLakeCentersAround(playerTileX, playerTileY);

    const newTiles = new Map();
    const newStones = new Map();
    const newWaterTiles = new Map();

    for (let y = -tileRangeY; y <= tileRangeY; y++) {
      for (let x = -tileRangeX; x <= tileRangeX; x++) {
        const tx = playerTileX + x;
        const ty = playerTileY + y;
        const key = `${tx}_${ty}`;

        // === Verifica se est� dentro de um lago ===
        let isWater = false;
        for (const center of lakeCenters) {
          const dx = tx - center.x;
          const dy = ty - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= 4 + (this.simpleHash(tx, ty) % 3)) {
            isWater = true;
            break;
          }
        }

        if (isWater) {
          if (!this.waterTiles.has(key)) {
            const water = this.scene.physics.add.staticSprite(
              tx * this.tileSize + this.tileSize / 2,
              ty * this.tileSize + this.tileSize / 2,
              'water'
            );
            water.anims.play({ key: 'water_anim', startFrame: 0 }, true);
            water.setDepth(-90);
            this.scene.waterBlockGroup.add(water);
            newWaterTiles.set(key, water);
          } else {
            newWaterTiles.set(key, this.waterTiles.get(key));
          }
          continue; // N�o gera ch�o/pedra se for �gua
        }

        // === Tile do ch�o ===
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

        // === Pedra ===
        const hash = this.simpleHash(tx, ty);
        const chance = hash % 100;

        if (chance < 10) {
          if (!this.stones.has(key)) {
            const stoneIndex = (hash % 6) + 1;
            const stoneData = this.stonesData[stoneIndex];

            const maxOffsetX = this.tileSize - stoneData.width;
            const maxOffsetY = this.tileSize - stoneData.height;

            const offsetX = (hash * 3) % maxOffsetX;
            const offsetY = (hash * 7) % maxOffsetY;

            const stoneX = tx * this.tileSize + offsetX + stoneData.width / 2;
            const stoneY = ty * this.tileSize + offsetY + stoneData.height / 2;

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

    // === Limpeza de tiles antigos ===
    this.tiles.forEach((tile, key) => {
      if (!newTiles.has(key)) tile.destroy();
    });

    this.stones.forEach((stone, key) => {
      if (!newStones.has(key)) stone.destroy();
    });

    this.waterTiles.forEach((water, key) => {
      if (!newWaterTiles.has(key)) water.destroy();
    });

    // Atualiza os mapas
    this.tiles = newTiles;
    this.stones = newStones;
    this.waterTiles = newWaterTiles;
  }
}
