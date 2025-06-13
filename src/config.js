import GameScene from './scenes/GameScene.js';

export default {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1d1d1d',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,   // modo resize para redimensionar sempre que a tela mudar
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
    min: { width: 960, height: 540 },
    max: { width: 3840, height: 2160 },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [GameScene],
};


