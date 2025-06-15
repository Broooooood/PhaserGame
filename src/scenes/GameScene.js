//GameScene.js

import Player from '../characters/Player.js';
import Slime from '../characters/enemies/Slime.js';
import MapGenerator from '../map/Generator.js';


export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    //tiles do chão
    for (let i = 1; i <= 64; i++) {
      const num = i.toString().padStart(2, '0');
      this.load.image(`tile_${num}`, `src/assets/tiles/FieldsTile_${num}.png`);
    }

    //tiles das pedras
    for (let i = 1; i <= 6; i++) {
      this.load.image(`stone_${i}`, `src/assets/decorations/stones/${i}.png`);
    }

    //preload water
    this.load.spritesheet('water', 'src/assets/water/water.png', {
      frameWidth: 64,
      frameHeight: 64
    });


    //Player preload
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

    //Slime preload
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

    //Goblin preload
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

      //Wolf preload
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
  //Bee preload
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
    //gerar mapa
  this.tileSize = 32;

  this.mapGenerator = new MapGenerator(this, this.tileSize);

  this.player = new Player(this, 0, 0);

  this.slimesGroup = this.physics.add.group();
  const slime = new Slime(this, 100, 100, this.player);
  this.slimesGroup.add(slime);

  this.physics.add.overlap(this.player, this.slimesGroup, (player, slime) => {
    slime.dealDamage(player);
  });

  this.physics.add.overlap(this.player.attackHitbox, this.slimesGroup, (hitbox, slime) => {
    if (this.player.isAttacking && !slime.isDead) {
      slime.takeDamage(20);
    }
  });

  // Barra de vida
  this.healthBarBackground = this.add.rectangle(0, 0, 128, 10, 0x000000).setOrigin(0.5);
  this.healthBarFill = this.add.rectangle(0, 0, 128, 10, 0xff0000).setOrigin(0, 0.5);

  // Mundo e c�mera gigantes
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


    this.slimesGroup.children.iterate((slime) => {
      slime.update();
    });

 const healthPercent = this.player.currentHealth / this.player.maxHealth;
  this.healthBarFill.width = 128 * healthPercent;

  // Posi��o da barra: x central do player, y acima dele
  const barX = this.player.x;
  const barY = this.player.y - 80;

  // Posiciona o fundo centralizado
  this.healthBarBackground.setPosition(barX, barY);

  // Posiciona o preenchimento alinhado � esquerda do fundo
  this.healthBarFill.setPosition(barX - 128 / 2, barY);
  }
}
