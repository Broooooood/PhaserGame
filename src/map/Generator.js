// src/map/Generator.js


export default class MapGenerator {
  constructor(scene, tileSize) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.tiles = new Map();
    this.stones = new Map();
    this.grass = new Map();
    this.waterTiles = new Map();
    this.trees = new Map();
    this.chunkSize = 32;
    this.seed = Date.now();

    this.grassData = {
      1: { width: 10, height: 9 },
      2: { width: 9, height: 7 },
      3: { width: 6, height: 5 },
      4: { width: 4, height: 3 },
      5: { width: 9, height: 8 },
      6: { width: 11, height: 9 }
    };

    this.stonesData = {
      1: { width: 5, height: 6 },
      2: { width: 9, height: 6 },
      3: { width: 5, height: 7 },
      4: { width: 8, height: 5 },
      5: { width: 6, height: 10 },
      6: { width: 5, height: 8 }
    };
  }

 simpleHash(x, y) {
  const xHash = (x >= 0 ? x : ~x + 1) * 73856093;
  const yHash = (y >= 0 ? y : ~y + 1) * 19349663;
  return ((xHash ^ yHash ^ this.seed) >>> 0) % 100000;
}

  isLakeTile(tx, ty, centers) {
    for (const center of centers) {
      const dx = tx - center.x;
      const dy = ty - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 4 + (this.simpleHash(tx, ty) % 3)) {
        return true;
      }
    }
    return false;
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
        const hasLake = hash % 4 === 0;
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
  const newGrass = new Map();
  const newTrees = new Map();


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
        continue; // N�o gera ch�o/pedra/grama se for �gua
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

// === Árvores ===
const treeChance = hash % 100;
if (treeChance < 3) {
    if (!this.trees.has(key)) {
        const treeIndex = (hash % 2) + 1;

        const offsetRange = this.tileSize * 0.3;
        const offsetX = (Math.random() - 0.5) * offsetRange;
        const offsetY = (Math.random() - 0.5) * offsetRange;

        const treeX = tx * this.tileSize + this.tileSize / 2 + offsetX;
        const treeY = ty * this.tileSize + this.tileSize / 2 + offsetY;

        const minScale = 1.2;
        const maxScale = 1.7;
        const scale = minScale + Math.random() * (maxScale - minScale);

        const radius = 16 * scale;

        // Função para checar se árvore invade água
        function isInWater(x, y, radius, tileSize, waterTiles) {
            const minTileX = Math.floor((x - radius) / tileSize);
            const maxTileX = Math.floor((x + radius) / tileSize);
            const minTileY = Math.floor((y - radius) / tileSize);
            const maxTileY = Math.floor((y + radius) / tileSize);

            for (let ty = minTileY; ty <= maxTileY; ty++) {
                for (let tx = minTileX; tx <= maxTileX; tx++) {
                    if (waterTiles.has(`${tx}_${ty}`)) {
                        return true;
                    }
                }
            }
            return false;
        }

        if (isInWater(treeX, treeY, radius, this.tileSize, this.waterTiles)) {
            continue;
        }
        
        // Checar distância das outras árvores de forma mais robusta
        let tooClose = false;
        // O raio de verificação em tiles. Calculado com base na distância mínima.
        const checkRadiusInTiles = 4;

        for (let dy = -checkRadiusInTiles; dy <= checkRadiusInTiles; dy++) {
            for (let dx = -checkRadiusInTiles; dx <= checkRadiusInTiles; dx++) {
                const neighborKey = `${tx + dx}_${ty + dy}`;
                let otherTree = null;

                // Não precisa checar o próprio tile, pois a árvore ainda não foi adicionada
                if (dx === 0 && dy === 0) continue;

                // Procura a árvore no mapa de novas árvores ou no mapa de árvores existentes
                if (newTrees.has(neighborKey)) {
                    otherTree = newTrees.get(neighborKey);
                } else if (this.trees.has(neighborKey)) {
                    otherTree = this.trees.get(neighborKey);
                }

                // Se uma árvore foi encontrada no tile vizinho, calcula a distância
                if (otherTree) {
                    const d_x = otherTree.x - treeX;
                    const d_y = otherTree.y - treeY;
                    const dist = Math.sqrt(d_x * d_x + d_y * d_y);

                    const otherRadius = 16 * otherTree.scaleX;
                    const minDist = radius + otherRadius + 60;

                    if (dist < minDist) {
                        tooClose = true;
                        break; // Sai do loop de `dx`
                    }
                }
            }
            if (tooClose) {
                break; // Sai do loop de `dy`
            }
        }

        if (!tooClose) {
            const tree = this.scene.add.image(treeX, treeY, `tree_${treeIndex}`);
            tree.setScale(scale);

            const relativeY = ty - playerTileY;
            const baseDepth = 1000;
            const depthPerTile = 10;
            tree.setDepth(baseDepth + relativeY * depthPerTile);

            newTrees.set(key, tree);
        }
    } else {
        newTrees.set(key, this.trees.get(key));
    }
    } else {
        if (this.trees.has(key)) {
            this.trees.get(key).destroy();
        }
    }

      // === Relva ===

      // Zonas de relva (blocos de 8x8)
      const grassZone = this.simpleHash(Math.floor(tx / 8), Math.floor(ty / 8)) % 5 === 0;

      // Checa se est� perto de lago para aumentar chance
      const isNearLake = lakeCenters.some(center => {
        const dx = tx - center.x;
        const dy = ty - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist <= 7;
      });

      const grassChance = (hash >> 1) % 100;
      let finalGrassChance = 50; // Base 50% chance de relva

      if (grassZone) finalGrassChance += 20; // +20% em zona de relva
      if (isNearLake) finalGrassChance += 30; // +30% perto de lago

      if (grassChance < finalGrassChance) {
        if (!this.grass.has(key)) {
            const grassType = (hash % 6) + 1;
            const grassData = this.grassData[grassType];

            const maxOffsetX = this.tileSize - grassData.width;
            const maxOffsetY = this.tileSize - grassData.height;

            const offsetX = (hash * 5) % maxOffsetX;
            const offsetY = (hash * 11) % maxOffsetY;

            const grassX = tx * this.tileSize + offsetX + grassData.width / 2;
            const grassY = ty * this.tileSize + offsetY + grassData.height / 2;

            const grass = this.scene.add.image(grassX, grassY, `grass_${grassType}`);
            grass.setDepth(-70);

            // ** Escala variável **
            const baseScale = 0.6;          // tamanho base mínimo
            const maxScale = 3;           // tamanho máximo
            // valor aleatório entre baseScale e maxScale
            const scale = baseScale + Math.random() * (maxScale - baseScale);
            grass.setScale(scale);

            newGrass.set(key, grass);
          } else {
            newGrass.set(key, this.grass.get(key));
          }
        } else {
          if (this.grass.has(key)) {
            this.grass.get(key).destroy();
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

  this.grass.forEach((grass, key) => {
    if (!newGrass.has(key)) grass.destroy();
  });

  this.trees.forEach((tree, key) => {
    if (!newTrees.has(key)) tree.destroy();
  });



  // Atualiza os mapas
  this.tiles = newTiles;
  this.stones = newStones;
  this.waterTiles = newWaterTiles;
  this.grass = newGrass;
  this.trees = newTrees;
}
}
