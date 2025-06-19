// main.js

import config from './config.js';

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  setTimeout(() => {
    // Pega a cena ativa (qualquer que seja)
    const scene = game.scene.isActive('GameScene') ? game.scene.getScene('GameScene') : game.scene.getScene('MainMenuScene');
    // Uma forma ainda melhor:
    const activeScene = game.scene.scenes.find(scene => game.scene.isActive(scene.scene.key));


    if (!activeScene) return;

    // Pega as dimensões da janela
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Redimensiona o canvas do jogo
    game.scale.resize(width, height);

    // Ajusta a câmera da cena ativa
    const cam = activeScene.cameras.main;
    cam.setSize(width, height);
    if (activeScene.mapWidth && activeScene.mapHeight) {
        // Lógica específica da GameScene
        const zoom = Math.min(width / activeScene.mapWidth, height / activeScene.mapHeight);
        cam.setZoom(zoom);
        cam.centerOn(activeScene.mapWidth / 2, activeScene.mapHeight / 2);
    } else {
        cam.setZoom(1);
        cam.centerOn(game.scale.width / 2, game.scale.height / 2);
    }

  }, 10);
});

// Dispara um evento de resize inicial para garantir que tudo fique no lugar
window.dispatchEvent(new Event('resize'));