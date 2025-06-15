// GameScene.js

import Player from '../characters/Player.js';
import Slime from '../characters/enemies/Slime.js';
import Goblin from '../characters/enemies/Goblin.js';
import Wolf from '../characters/enemies/Wolf.js';
import Bee from '../characters/enemies/Bee.js';
import MapGenerator from '../map/Generator.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Carregamento dos tiles do chão
    for (let i = 1; i <= 64; i++) {
      const num = i.toString().padStart(2, '0');
      this.load.image(`tile_${num}`, `src/assets/tiles/FieldsTile_${num}.png`);
    }

    // Carregamento dos tiles das pedras
    for (let i = 1; i <= 6; i++) {
      this.load.image(`stone_${i}`, `src/assets/decorations/stones/${i}.png`);
    }

    // Carregamento dos tiles de relva
    for (let i = 1; i <= 6; i++) {
      const num = i.toString().padStart(2, '0');
      this.load.image(`grass_${i}`, `src/assets/decorations/grass/${i}.png`);
    }

    // Preload da água (spritesheet)
    this.load.spritesheet('water', 'src/assets/water/water1.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    // Preload do Player (diversas animações)
    this.load.spritesheet('player_run', 'src/assets/player/Run.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_idle', 'src/assets/player/Idle.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_walk', 'src/assets/player/Walk.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_attack1', 'src/assets/player/Attack1.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_attack2', 'src/assets/player/Attack2.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_attack3', 'src/assets/player/Attack3.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_attackRun', 'src/assets/player/Run+Attack.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_Dead', 'src/assets/player/Dead.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('player_hurt', 'src/assets/player/Hurt.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    // Preload dos inimigos

    // Slime
    const slimeFrames = {
      side: ['S_Walk.png', 'S_Walk2.png', 'S_Death.png', 'S_Death2.png', 'S_Special.png'],
      down: ['D_Walk.png', 'D_Walk2.png', 'D_Death.png', 'D_Death2.png', 'D_Special.png'],
      up: ['U_Walk.png', 'U_Walk2.png', 'U_Death.png', 'U_Death.png', 'U_Special.png'],
    };
    for (const direction in slimeFrames) {
      slimeFrames[direction].forEach((fileName) => {
        const cleanName = fileName.replace('.png', '');
        const key = `slime_${cleanName}`;
        const path = `src/assets/enemies/slime/${fileName}`;
        this.load.spritesheet(key, path, {
          frameWidth: 48,
          frameHeight: 48
        });
      });
    }

    // Goblin
    const goblinFrames = {
      side: ['S_Walk.png', 'S_Death.png', 'S_Attack.png'],
      down: ['D_Walk.png', 'D_Death.png', 'D_Attack.png'],
      up: ['U_Walk.png', 'U_Death.png', 'U_Attack.png'],
    };
    for (const direction in goblinFrames) {
      goblinFrames[direction].forEach((fileName) => {
        const cleanName = fileName.replace('.png', '');
        const key = `goblin_${cleanName}`;
        const path = `src/assets/enemies/goblin/${fileName}`;
        this.load.spritesheet(key, path, {
          frameWidth: 48,
          frameHeight: 48
        });
      });
    }

    // Wolf
    const wolfFrames = {
      side: ['S_Walk.png', 'S_Death.png', 'S_Attack.png'],
      down: ['D_Walk.png', 'D_Death.png', 'D_Attack.png'],
      up: ['U_Walk.png', 'U_Death.png', 'U_Attack.png'],
    };
    for (const direction in wolfFrames) {
      wolfFrames[direction].forEach((fileName) => {
        const cleanName = fileName.replace('.png', '');
        const key = `wolf_${cleanName}`;
        const path = `src/assets/enemies/wolf/${fileName}`;
        this.load.spritesheet(key, path, {
          frameWidth: 48,
          frameHeight: 48
        });
      });
    }

    // Bee
    const beeFrames = {
      side: ['S_Walk.png', 'S_Death.png'],
      down: ['D_Walk.png', 'D_Death.png'],
      up: ['U_Walk.png', 'U_Death.png'],
    };
    
    for (const direction in beeFrames) {
      beeFrames[direction].forEach((fileName) => {
        const cleanName = fileName.replace('.png', '');
        const key = `bee_${cleanName}`;
        const path = `src/assets/enemies/bee/${fileName}`;
        this.load.spritesheet(key, path, {
          frameWidth: 48,
          frameHeight: 48
        });
      });
    }
  }

  create() {
    // Gerar mapa
    this.tileSize = 32;
    this.mapGenerator = new MapGenerator(this, this.tileSize);

    // Animação da água
    this.anims.create({
      key: 'water_anim',
      frames: this.anims.generateFrameNumbers('water', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.waterBlockGroup = this.physics.add.staticGroup();

    // Encontrar posição válida para o jogador (fora da água)
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

    // Criar jogador fora da água
    this.player = new Player(this, playerX, playerY);
    this.physics.add.collider(this.player, this.waterBlockGroup);

    // Criar grupo genérico de inimigos
    this.enemiesGroup = this.physics.add.group();
    
    // Spawner: spawn aleatório a cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnRandomEnemy,
      callbackScope: this,
      loop: true
    });

    // Barra de vida do player
    this.healthBarBackground = this.add.rectangle(0, 0, 128, 10, 0x000000).setOrigin(0.5);
    this.healthBarFill = this.add.rectangle(0, 0, 128, 10, 0xff0000).setOrigin(0, 0.5);

    // Mundo e câmera gigantes
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
    this.player.update(time);

    this.mapGenerator.update(this.player.x, this.player.y);

    // Atualizar todos os inimigos
    this.enemiesGroup.getChildren().forEach(enemy => {
      enemy.update(time, delta);
    });

    // Atualizar barra de vida do player
    const healthPercent = this.player.currentHealth / this.player.maxHealth;
    this.healthBarFill.width = 128 * healthPercent;

    // Posicionar a barra acima do player
    const barX = this.player.x;
    const barY = this.player.y - 80;

    this.healthBarBackground.setPosition(barX, barY);
    this.healthBarFill.setPosition(barX - 128 / 2, barY);
  }

  setupEnemyCollisions(enemy) {
  this.physics.add.collider(enemy, this.waterBlockGroup);

  this.physics.add.overlap(this.player, enemy, (player, enemy) => {
    enemy.dealDamage(player);
  });

  this.physics.add.overlap(this.player.attackHitbox, enemy, (hitbox, enemy) => {
    if (this.player.isAttacking && !enemy.isDead) {
      enemy.takeDamage(20);
    }
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

}
