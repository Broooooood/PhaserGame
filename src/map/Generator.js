// src/map/MapGenerator.js
import Phaser from 'phaser';

class Generator { // <-- Nome alterado para Generator
    constructor(width, height, tileSize) {
        this.MAP_WIDTH = width;
        this.MAP_HEIGHT = height;
        this.TILE_SIZE = tileSize;
        this.mapData = [];
    }

    // Inicializa o mapa com um tile padrão (ex: parede)
    initializeMap(defaultTileIndex = 0) {
        this.mapData = [];
        for (let y = 0; y < this.MAP_HEIGHT; y++) {
            this.mapData[y] = [];
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                this.mapData[y][x] = defaultTileIndex;
            }
        }
    }

    createRoom(x, y, width, height, floorTileIndex = 1) {
        for (let ry = y; ry < y + height; ry++) {
            for (let rx = x; rx < x + width; rx++) {
                if (rx >= 0 && rx < this.MAP_WIDTH && ry >= 0 && ry < this.MAP_HEIGHT) {
                    this.mapData[ry][rx] = floorTileIndex;
                }
            }
        }
    }

    createCorridor(x1, y1, x2, y2, floorTileIndex = 1) {
        let currentX = x1;
        let currentY = y1;

        // Corredor horizontal
        while (currentX !== x2) {
            if (currentX < x2) currentX++;
            else currentX--;
            if (currentX >= 0 && currentX < this.MAP_WIDTH && currentY >= 0 && currentY < this.MAP_HEIGHT) {
                this.mapData[currentY][currentX] = floorTileIndex;
            }
        }

        // Corredor vertical
        while (currentY !== y2) {
            if (currentY < y2) currentY++;
            else currentY--;
            if (currentX >= 0 && currentX < this.MAP_WIDTH && currentY >= 0 && currentY < this.MAP_HEIGHT) {
                this.mapData[currentY][currentX] = floorTileIndex;
            }
        }
    }

    // Método principal para gerar o mapa
    generateDungeonMap(numRooms = 5, minRoomSize = 5, maxRoomSize = 15, wallTile = 0, floorTile = 1) {
        this.initializeMap(wallTile);

        const rooms = [];
        for (let i = 0; i < numRooms; i++) {
            const roomWidth = Phaser.Math.Between(minRoomSize, maxRoomSize);
            const roomHeight = Phaser.Math.Between(minRoomSize, maxRoomSize);
            const roomX = Phaser.Math.Between(1, this.MAP_WIDTH - roomWidth - 1);
            const roomY = Phaser.Math.Between(1, this.MAP_HEIGHT - roomHeight - 1);

            this.createRoom(roomX, roomY, roomWidth, roomHeight, floorTile);
            rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
        }

        // Conectar as salas
        for (let i = 0; i < rooms.length - 1; i++) {
            const room1 = rooms[i];
            const room2 = rooms[i + 1];

            const center1X = room1.x + Math.floor(room1.width / 2);
            const center1Y = room1.y + Math.floor(room1.height / 2);
            const center2X = room2.x + Math.floor(room2.width / 2);
            const center2Y = room2.y + Math.floor(room2.height / 2);

            this.createCorridor(center1X, center1Y, center2X, center2Y, floorTile);
        }

        return this.mapData;
    }

    // ... você pode adicionar outros métodos de geração aqui (e.g., autotiling)
}

export default Generator;