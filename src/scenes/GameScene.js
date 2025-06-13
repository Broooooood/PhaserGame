
import Phaser from 'phaser';
import Generator from '../map/Generator.js'; // Importe a classe do gerador de mapa

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.MAP_WIDTH = 50; // Largura do mapa em tiles
        this.MAP_HEIGHT = 50; // Altura do mapa em tiles
        this.TILE_SIZE = 16;
    }

    preload() {
        this.load.image('tiles', 'assets/tileSet/walls_floor.png');
    }

    create() {
        // Crie uma instância do seu gerador de mapa
        const mapGenerator = new Generator(this.MAP_WIDTH, this.MAP_HEIGHT, this.TILE_SIZE);

        // Gere os dados do mapa usando o gerador
        // Os índices 0 e 1 são apenas exemplos para parede e chão.
        // Você precisará mapear para os seus tiles reais no walls_floor.png.
        const generatedMapData = mapGenerator.generateDungeonMap(
            Phaser.Math.Between(5, 10), // Número aleatório de salas
            5, 15, // Tamanho mínimo e máximo das salas
            0, // Índice do tile de parede (exemplo)
            1  // Índice do tile de chão (exemplo)
        );

        // Crie o Tilemap no Phaser a partir dos dados gerados
        const map = this.make.tilemap({ data: generatedMapData, tileWidth: this.TILE_SIZE, tileHeight: this.TILE_SIZE });

        // Adicione o Tileset à camada
        const tileset = map.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);

        // Crie a camada
        const groundLayer = map.createLayer(0, tileset, 0, 0);

        // Ajuste a câmera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // this.cameras.main.setZoom(1); // Ajuste o zoom conforme necessário
    }

    update(time, delta) {
        // Lógica de atualização aqui
    }
}

export default GameScene;