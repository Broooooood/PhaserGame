import config from './config.js';

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {

  setTimeout(() => {
  // Pega a cena ativa pelo nome
  const scene = game.scene.getScene('GameScene');

  if (!scene) return;

  // Pega as dimensões da janela
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Redimensiona o jogo
  game.scale.resize(width, height);

  // Ajusta a câmera para cobrir o mapa inteiro e manter proporção
  const cam = scene.cameras.main;

  cam.setSize(width, height);

  // Zoom proporcional para caber a tela sem distorção
  const zoom = Math.min(width / scene.mapWidth, height / scene.mapHeight);

  cam.setZoom(zoom);

  // Centraliza no meio do mapa
  cam.centerOn(scene.mapWidth / 2, scene.mapHeight / 2);
  },10);
});
