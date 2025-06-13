import config from './config.js';

const game = new Phaser.Game(config);

// Opcional: para lidar com resize manual (quase nunca necessário com FIT)
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
