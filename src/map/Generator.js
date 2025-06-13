// src/map/MapGenerator.js
import Phaser from 'phaser';

class Generator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  // Inicializa todo mapa com paredes (0)
  initMap() {
    this.map = [];
    for (let y = 0; y < this.height; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = 0; // parede
      }
    }
  }

  // Cria uma sala preenchendo tiles com chão (1)
  createRoom(x, y, w, h) {
    for (let ry = y; ry < y + h; ry++) {
      for (let rx = x; rx < x + w; rx++) {
        if (ry > 0 && ry < this.height && rx > 0 && rx < this.width) {
          this.map[ry][rx] = 1; // chão
        }
      }
    }
  }

  // Cria um corredor horizontal ou vertical ligando 2 pontos
  createCorridor(x1, y1, x2, y2) {
    let x = x1;
    let y = y1;

    while (x !== x2 || y !== y2) {
      if (x !== x2) x += (x < x2) ? 1 : -1;
      else if (y !== y2) y += (y < y2) ? 1 : -1;

      if (y > 0 && y < this.height && x > 0 && x < this.width) {
        this.map[y][x] = 1;
      }
    }
  }

  // Gera o mapa: cria N salas aleatórias e conecta com corredores
  generateDungeonMap(numRooms = 6, minSize = 5, maxSize = 12) {
    this.initMap();

    const rooms = [];

    for (let i = 0; i < numRooms; i++) {
      const w = Phaser.Math.Between(minSize, maxSize);
      const h = Phaser.Math.Between(minSize, maxSize);
      const x = Phaser.Math.Between(1, this.width - w - 1);
      const y = Phaser.Math.Between(1, this.height - h - 1);

      this.createRoom(x, y, w, h);
      rooms.push({ x, y, w, h });
    }

    // Conecta as salas com corredores
    for (let i = 0; i < rooms.length - 1; i++) {
      const roomA = rooms[i];
      const roomB = rooms[i + 1];

      // Centros das salas
      const centerAx = Math.floor(roomA.x + roomA.w / 2);
      const centerAy = Math.floor(roomA.y + roomA.h / 2);
      const centerBx = Math.floor(roomB.x + roomB.w / 2);
      const centerBy = Math.floor(roomB.y + roomB.h / 2);

      // Cria corredor ligando os centros
      this.createCorridor(centerAx, centerAy, centerBx, centerBy);
    }

    return this.map;
  }
}

export default Generator;
