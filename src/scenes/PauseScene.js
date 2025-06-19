// scenes/PauseScene.js

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Criar um fundo semi-transparente
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // 2. Adicionar texto e bot�es
        this.add.text(width / 2, height / 2 - 150, 'JOGO PAUSADO', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Bot�o de Continuar
        const resumeButton = this.add.text(width / 2, height / 2, 'Continuar', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 32, y: 16 }
        }).setOrigin(0.5);

        // Bot�o de Voltar ao Menu Principal
        const menuButton = this.add.text(width / 2, height / 2 + 100, 'Menu Principal', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ff0000',
            backgroundColor: '#333333',
            padding: { x: 32, y: 16 }
        }).setOrigin(0.5);

        // 3. Adicionar interatividade aos bot�es

        // --- Bot�o Continuar ---
        resumeButton.setInteractive();
        resumeButton.on('pointerover', () => this.game.canvas.style.cursor = 'pointer');
        resumeButton.on('pointerout', () => this.game.canvas.style.cursor = 'default');
        resumeButton.on('pointerdown', () => {
            this.game.canvas.style.cursor = 'default';
            this.scene.stop(); // Fecha a cena de pausa
            this.scene.resume('GameScene'); // Retoma a cena do jogo
        });

        // --- Bot�o Menu Principal ---
        menuButton.setInteractive();
        menuButton.on('pointerover', () => this.game.canvas.style.cursor = 'pointer');
        menuButton.on('pointerout', () => this.game.canvas.style.cursor = 'default');
        menuButton.on('pointerdown', () => {
            this.game.canvas.style.cursor = 'default';
            // **CORRE��O AQUI:** Parar a GameScene antes de iniciar o MainMenuScene
            this.scene.stop('GameScene');   // Adicione esta linha para parar a GameScene
            this.scene.stop('PauseScene');  // Adicione esta linha para parar a PauseScene
            this.scene.start('MainMenuScene'); // Inicia a cena do menu principal
        });

        // Opcional: Permitir que a tecla ESC tamb�m feche o menu de pausa
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });
    }
}