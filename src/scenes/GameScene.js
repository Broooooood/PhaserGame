import Player from '../characters/Player.js';
import Slime from '../characters/enemies/Slime.js';


export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
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

    this.load.spritesheet('player_attak1', 'src/assets/player/Attack1.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_attak2', 'src/assets/player/Attack2.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_attak3', 'src/assets/player/Attack3.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_attakRun', 'src/assets/player/Run+Attack.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('player_Dead', 'src/assets/player/Dead.png', {
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
    this.mapWidth = 1920;
    this.mapHeight = 1080;

    this.player = new Player(this, this.mapWidth / 2, this.mapHeight / 2);

    this.slimesGroup = this.physics.add.group();
    const slime = new Slime(this, 100, 100, this.player);
    this.slimesGroup.add(slime);

    this.physics.add.overlap(this.player, this.slimesGroup, (player, slime) => {
      slime.dealDamage(player);
    });

    this.physics.add.overlap(this.player.attackHitbox, this.slimesGroup, (hitbox, slime) => {
      if (this.player.isAttacking && !slime.isDead) {
        slime.takeDamage(20); // ou outro valor
      }
    });


  // Barra de fundo preta, origem central
    this.healthBarBackground = this.add.rectangle(0, 0, 128, 10, 0x000000);
    this.healthBarBackground.setOrigin(0.5, 0.5);

    // Barra vermelha de preenchimento, origem à esquerda e verticalmente centralizada
    this.healthBarFill = this.add.rectangle(0, 0, 128, 10, 0xff0000);
    this.healthBarFill.setOrigin(0, 0.5);


    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.mapWidth, this.mapHeight);
    cam.startFollow(this.player, true, 0.1, 0.1);

    this.adjustCameraZoom();

    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize) {
    if (!gameSize) return;
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.adjustCameraZoom();
  }

  adjustCameraZoom() {
    const width = this.scale.width;
    const height = this.scale.height;

    const zoomX = width / this.mapWidth;
    const zoomY = height / this.mapHeight;
    const zoom = Math.min(zoomX, zoomY);

    this.cameras.main.setZoom(zoom);
  }

  update(time, delta) {
    this.player.update(time);

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
