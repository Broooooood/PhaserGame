// scenes/PauseScene.js

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');

    // Propriedades para guardar os elementos da UI
    this.background = null;
    this.pauseText = null;
    this.resumeButton = null;
    this.menuButton = null;
  }

  create() {
    // --- Cria os elementos da UI e guarda as refer�ncias ---

    // 1. Fundo semi-transparente (o tamanho ser� ajustado dinamicamente)
    this.background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.7).setOrigin(0);

    // 2. Texto "JOGO PAUSADO"
    this.pauseText = this.add.text(0, 0, 'JOGO PAUSADO', {
      fontFamily: 'Arial',
      fontSize: '64px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Bot�o de Continuar
    this.resumeButton = this.add.text(0, 0, 'Continuar', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#00ff00',
      backgroundColor: '#333333',
      padding: { x: 32, y: 16 }
    }).setOrigin(0.5);

    // Bot�o de Voltar ao Menu Principal
    this.menuButton = this.add.text(0, 0, 'Menu Principal', {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#ff0000',
      backgroundColor: '#333333',
      padding: { x: 32, y: 16 }
    }).setOrigin(0.5);

    // 3. Adiciona interatividade aos bot�es (l�gica original mantida)

    // --- Bot�o Continuar ---
    this.resumeButton.setInteractive();
    this.resumeButton.on('pointerover', () => this.game.canvas.style.cursor = 'pointer');
    this.resumeButton.on('pointerout', () => this.game.canvas.style.cursor = 'default');
    this.resumeButton.on('pointerdown', () => {
      this.game.canvas.style.cursor = 'default';
      this.scene.stop(); // Fecha a cena de pausa
      this.scene.resume('GameScene'); // Retoma a cena do jogo
    });

    // --- Bot�o Menu Principal ---
    this.menuButton.setInteractive();
    this.menuButton.on('pointerover', () => this.game.canvas.style.cursor = 'pointer');
    this.menuButton.on('pointerout', () => this.game.canvas.style.cursor = 'default');
    this.menuButton.on('pointerdown', () => {
      this.game.canvas.style.cursor = 'default';
      this.scene.stop('GameScene');
      this.scene.stop(); // Para a cena atual (PauseScene)
      this.scene.start('MainMenuScene');
    });

    // Opcional: Permitir que a tecla ESC tamb�m feche o menu de pausa
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
    });


    // "Escuta" o evento 'resize'
    this.scale.on('resize', this.handleResize, this);

    // Chama a fun��o para definir a posi��o inicial
    this.handleResize({ width: this.scale.width, height: this.scale.height });
  }

  handleResize(gameSize) {
    const { width, height } = gameSize;
    this.background.setSize(width, height);
    this.pauseText.setPosition(width / 2, height / 2 - 150);
    this.resumeButton.setPosition(width / 2, height / 2);
    this.menuButton.setPosition(width / 2, height / 2 + 100);
  }
}