//src/util/preloadAssets.js

export function preloadAssets(scene) {
  // Carregamento dos tiles do chão
  for (let i = 1; i <= 64; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`tile_${num}`, `src/assets/tiles/FieldsTile_${num}.png`);
  }

  // Carregamento dos tiles das pedras
  for (let i = 1; i <= 6; i++) {
    scene.load.image(`stone_${i}`, `src/assets/decorations/stones/${i}.png`);
  }

  // Carregamento dos tiles de relva
  for (let i = 1; i <= 6; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`grass_${i}`, `src/assets/decorations/grass/${i}.png`);
  }

  // box = caixas
  for (let i = 1; i <= 6; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`box_${i}`, `src/assets/obstacles/boxs/${i}.png`);
  }

  // shadow = sombra
  for (let i = 1; i <= 6; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`shadow_${i}`, `src/assets/decorations/shadow/${i}.png`);
  }

  // tree = arvores
  for (let i = 1; i <= 2; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`tree_${i}`, `src/assets/obstacles/tree/Tree${i}.png`);
  }

  // logs = troncos
  for (let i = 1; i <= 4; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`log_${i}`, `src/assets/obstacles/logs/Log${i}.png`);
  }

  //camps
   for (let i = 1; i <= 4; i++) {
    const num = i.toString().padStart(2, '0');
    scene.load.image(`camp_${i}`, `src/assets/obstacles/camps/${i}.png`);
  }
  // fireplace down   
  // Preload da água (spritesheet)
  scene.load.spritesheet('water', 'src/assets/water/water1.png', {
    frameWidth: 64,
    frameHeight: 64
  });

  // Preload do Player (diversas animações)
  scene.load.spritesheet('player_run', 'src/assets/player/Run.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_idle', 'src/assets/player/Idle.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_walk', 'src/assets/player/Walk.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_attack1', 'src/assets/player/Attack1.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_attack2', 'src/assets/player/Attack2.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_attack3', 'src/assets/player/Attack3.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_attackRun', 'src/assets/player/Run+Attack.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_Dead', 'src/assets/player/Dead.png', {
    frameWidth: 128,
    frameHeight: 128
  });
  scene.load.spritesheet('player_hurt', 'src/assets/player/Hurt.png', {
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
      scene.load.spritesheet(key, path, {
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
      scene.load.spritesheet(key, path, {
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
      scene.load.spritesheet(key, path, {
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
      scene.load.spritesheet(key, path, {
        frameWidth: 48,
        frameHeight: 48
      });
    });
  }
}
