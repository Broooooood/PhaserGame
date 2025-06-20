import Player from '../characters/Player.js';
import Slime from '../characters/enemies/Slime.js';
import Goblin from '../characters/enemies/Goblin.js';
import Wolf from '../characters/enemies/Wolf.js';
import Bee from '../characters/enemies/Bee.js';
import MapGenerator from '../map/Generator.js';
import { preloadAssets } from '../util/preloadAssets.js';


export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        preloadAssets(this);
    }

    create() {
        this.physics.world.createDebugGraphic();
        this.tileSize = 32;
        this.mapGenerator = new MapGenerator(this, this.tileSize);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

  
        this.events.on('playerDeath', this.handlePlayerDeath, this);


        this.anims.create({
            key: 'water_anim',
            frames: this.anims.generateFrameNumbers('water', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.waterBlockGroup = this.physics.add.staticGroup();
        this.treeGroup = this.physics.add.staticGroup(); 

        let playerX = 0;
        let playerY = 0;
        let isInWater = true;
        let attempts = 0;

        while (isInWater && attempts < 1000) {
            playerX = Phaser.Math.Between(-500, 500);
            playerY = Phaser.Math.Between(-500, 500);

            const tileX = Math.floor(playerX / this.tileSize);
            const tileY = Math.floor(playerY / this.tileSize);

            isInWater = this.mapGenerator.getLakeCentersAround(tileX, tileY).some(center => {
                const dx = tileX - center.x;
                const dy = tileY - center.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                return dist <= 4 + (this.mapGenerator.simpleHash(tileX, tileY) % 3);
            });

            attempts++;
        }

        this.enemiesGroup = this.physics.add.group();

        this.player = new Player(this, playerX, playerY, this.enemiesGroup);
        this.physics.add.collider(this.player, this.waterBlockGroup);
        this.physics.add.collider(this.player, this.treeGroup); 
        this.physics.add.collider(this.player, this.enemiesGroup, (player, enemy) => { 
          enemy.dealDamage(player);
        });

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnRandomEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.world.setBounds(-100000, -100000, 200000, 200000);
        const cam = this.cameras.main;
        cam.setBounds(-100000, -100000, 200000, 200000);
        cam.startFollow(this.player, true, 0.1, 0.1);

        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        if (!gameSize) return;
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        this.adjustCameraZoom();
    }

    adjustCameraZoom() {
        const visibleTilesX = Math.floor(this.scale.width / this.tileSize);
        const visibleTilesY = Math.floor(this.scale.height / this.tileSize);

        const zoomX = this.scale.width / (visibleTilesX * this.tileSize);
        const zoomY = this.scale.height / (visibleTilesY * this.tileSize);

        const zoom = Math.min(zoomX, zoomY);
        this.cameras.main.setZoom(zoom);
    }

    update(time, delta) {
        if (!this.player.isDead) { 
            this.player.update(time);
        }
        this.mapGenerator.update(this.player.x, this.player.y);

        this.enemiesGroup.getChildren().forEach(enemy => {
            enemy.update(time, delta);
        });
    }

    setupEnemyCollisions(enemy) {
        this.physics.add.collider(enemy, this.waterBlockGroup);
        this.physics.add.collider(enemy, this.treeGroup); 

        this.physics.add.overlap(this.player, enemy, (player, enemy) => {
            enemy.dealDamage(player);
        });
    }

    spawnRandomEnemy() {
        const enemyTypes = [Slime, Goblin, Wolf, Bee];
        const EnemyClass = Phaser.Utils.Array.GetRandom(enemyTypes);

        let x = 0;
        let y = 0;
        let isInWater = true;
        let attempts = 0;

        while (isInWater && attempts < 100) {
            x = Phaser.Math.Between(this.player.x - 300, this.player.x + 300);
            y = Phaser.Math.Between(this.player.y - 300, this.player.y + 300);

            const tileX = Math.floor(x / this.tileSize);
            const tileY = Math.floor(y / this.tileSize);

            isInWater = this.mapGenerator.getLakeCentersAround(tileX, tileY).some(center => {
                const dx = tileX - center.x;
                const dy = tileY - center.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                return dist <= 4 + (this.mapGenerator.simpleHash(tileX, tileY) % 3);
            });

            attempts++;
        }

        const enemy = new EnemyClass(this, x, y, this.player);
        this.enemiesGroup.add(enemy);
        this.setupEnemyCollisions(enemy);
    }

    handlePlayerDeath() {
        console.log("Player has died! Transitioning to Main Menu.");
        this.scene.stop('GameScene'); 
        this.scene.stop('PauseScene');
        this.scene.start('MainMenuScene'); 
    }
}