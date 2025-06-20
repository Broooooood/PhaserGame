export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');

    // Vamos guardar referências aos nossos elementos de UI
    this.titleText = null;
    this.startButton = null;
  }

  preload() {
    // O preload pode continuar vazio se não houver assets a carregar
  }

  create() {
    this.cameras.main.setBackgroundColor('#1d1d1d');

    // Adiciona o título do jogo, mas sem posição inicial fixa
    this.titleText = this.add.text(0, 0, 'Trabalho Phaser', {
      fontFamily: 'Arial',
      fontSize: '64px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Cria um botão de "Iniciar Jogo", também sem posição inicial
    this.startButton = this.add.text(0, 0, 'Iniciar Jogo', {
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
    this.startButton.setInteractive();

    // Adiciona eventos ao botão
    this.startButton.on('pointerover', () => {
      this.startButton.setBackgroundColor('#555555');
      this.game.canvas.style.cursor = 'pointer';
    });

    this.startButton.on('pointerout', () => {
      this.startButton.setBackgroundColor('#333333');
      this.game.canvas.style.cursor = 'default';
    });

    this.startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
      this.game.canvas.style.cursor = 'default';
    });

    // 1. "Escuta" o evento 'resize' do gerenciador de escala do Phaser
    this.scale.on('resize', this.handleResize, this);

    // 2. Chama a função de redimensionamento uma vez para definir a posição inicial
    this.handleResize({ width: this.scale.width, height: this.scale.height });
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;

    // Centraliza o título
    this.titleText.setPosition(width / 2, height / 2 - 100);

    // Centraliza o botão
    this.startButton.setPosition(width / 2, height / 2 + 50);
  }
}