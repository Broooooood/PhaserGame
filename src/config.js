window.config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // não define width nem height fixos porque o canvas vai ser redimensionado
  },
  scene: [], // adicionada depois
};