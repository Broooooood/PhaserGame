// scenes/MainMenuScene.js

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
  }

  create() {
    const { width, height } = this.scale;

    // Adiciona uma cor de fundo (opcional, se já estiver no config)
    this.cameras.main.setBackgroundColor('#1d1d1d');

    // Adiciona o título do jogo
    this.add.text(width / 2, height / 2 - 100, 'Trabalho Phaser', {
      fontFamily: 'Arial',
      fontSize: '64px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Cria um botão de "Iniciar Jogo"
    const startButton = this.add.text(width / 2, height / 2 + 50, 'Iniciar Jogo', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#00ff00',
      backgroundColor: '#333333',
      padding: {
        x: 32,
        y: 16
      }
    }).setOrigin(0.5);

    // Torna o botão interativo
    startButton.setInteractive();

    // Adiciona eventos ao botão
    startButton.on('pointerover', () => {
      // Efeito de hover (ex: muda a cor de fundo)
      startButton.setBackgroundColor('#555555');
      this.game.canvas.style.cursor = 'pointer';
    });

    startButton.on('pointerout', () => {
      // Retorna à cor original
      startButton.setBackgroundColor('#333333');
      this.game.canvas.style.cursor = 'default';
    });

    startButton.on('pointerdown', () => {
      // Inicia a cena do jogo quando o botão é clicado
      this.scene.start('GameScene');
      this.game.canvas.style.cursor = 'default';
    });
  }
}