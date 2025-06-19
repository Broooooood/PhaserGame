// src/ui/UI.js

export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.player = scene.player; // A UI precisa de uma refer�ncia ao player

        this.createHealthBar();
        this.createHotbar();

        // Adiciona um listener para atualizar a UI a cada frame
        this.scene.events.on('update', this.update, this);
        // NOVO: Listener para quando a hotbar muda de sele��o (player.js notifica)
        this.scene.events.on('hotbarSelectedChanged', this.updateHotbarDisplay, this);
        // NOVO: Listener para quando uma habilidade � usada (player.js notifica)
        this.scene.events.on('abilityUsed', this.startHotbarCooldownVisual, this);
    }

    createHealthBar() {
        this.playerHealthBarBackground = this.scene.add.rectangle(
            this.scene.scale.width / 2,
            this.scene.scale.height - 30,
            200, 20, 0x000000 // Largura, altura, cor
        ).setOrigin(0.5).setScrollFactor(0).setDepth(100); // setScrollFactor(0) para fixar na tela
        this.playerHealthBarFill = this.scene.add.rectangle(
            this.playerHealthBarBackground.x - this.playerHealthBarBackground.width / 2,
            this.playerHealthBarBackground.y,
            200, 20, 0xff0000 // Cor do preenchimento (vermelho)
        ).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);
    }

    createHotbar() {
        const hotbarTotalSlots = 9; // 9 slots, como o Minecraft
        const slotSize = 64;
        const slotPadding = 4;
        const hotbarWidth = hotbarTotalSlots * slotSize + (hotbarTotalSlots - 1) * slotPadding;
        const hotbarHeight = slotSize;
        const startX = (this.scene.scale.width - hotbarWidth) / 2;
        const startY = this.scene.scale.height - hotbarHeight - 10;

        // Fundo da hotbar
        this.scene.add.rectangle(startX + hotbarWidth / 2, startY + hotbarHeight / 2, hotbarWidth + 10, hotbarHeight + 10, 0x333333, 0.8)
            .setOrigin(0.5)
            .setScrollFactor(0) // Fixo na tela
            .setDepth(100);

        this.hotbarSlots = [];
        this.hotbarItemContents = []; // Armazenar� sprites ou textos para os conte�dos dos slots
        this.hotbarCooldownOverlays = []; // Para exibir cooldowns

        for (let i = 0; i < hotbarTotalSlots; i++) {
            const slotX = startX + (i * (slotSize + slotPadding)) + slotSize / 2; // Centro do slot
            const slotY = startY + slotSize / 2;

            // Slot de fundo (um ret�ngulo cinza)
            const slotRect = this.scene.add.rectangle(slotX, slotY, slotSize, slotSize, 0x666666).setOrigin(0.5);
            slotRect.setInteractive();
            slotRect.on('pointerdown', () => this.player.setSelectedHotbarIndex(i)); // Player controla a sele��o
            slotRect.setScrollFactor(0).setDepth(101); // Fixo e acima do fundo

            this.hotbarSlots.push(slotRect);

            this.hotbarItemContents.push(null); // Inicializa com null
            this.hotbarCooldownOverlays.push(null); // Inicializa com null
        }

        this.updateHotbarDisplay(); // Chama pela primeira vez para desenhar os itens
    }

    updateHotbarDisplay() {
        // Limpa conte�dos e cooldowns existentes
        this.hotbarItemContents.forEach(content => { if (content) content.destroy(); });
        this.hotbarCooldownOverlays.forEach(overlay => { if (overlay) overlay.destroy(); });
        this.hotbarItemContents = [];
        this.hotbarCooldownOverlays = [];

        const playerAbilities = this.player.abilities;
        for (let i = 0; i < this.hotbarSlots.length; i++) {
            const slot = this.hotbarSlots[i];
            const ability = playerAbilities[i];

            // Desenha placeholder para o item/habilidade
            if (ability) {
                let content;
                // Voc� pode escolher exibir um ret�ngulo colorido, um texto, ou at� uma letra
                if (ability.id === 'attack') {
                    content = this.scene.add.text(slot.x, slot.y, 'ATK', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
                } else if (ability.id === 'thunderStrike') {
                    content = this.scene.add.text(slot.x, slot.y, 'T', { fontSize: '20px', fill: '#0ff' }).setOrigin(0.5);
                } else if (ability.id === 'explosion') {
                    content = this.scene.add.text(slot.x, slot.y, 'E', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5);
                } else if (ability.id === 'thunderSplash') {
                    content = this.scene.add.text(slot.x, slot.y, 'S', { fontSize: '20px', fill: '#00f' }).setOrigin(0.5);
                } else {
                    // Para slots vazios ou habilidades sem identificador espec�fico
                    content = this.scene.add.text(slot.x, slot.y, '', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
                }

                if (content) {
                    content.setScrollFactor(0).setDepth(102);
                    this.hotbarItemContents.push(content);
                } else {
                    this.hotbarItemContents.push(null);
                }
            } else {
                this.hotbarItemContents.push(null);
            }

            // Destaca o slot selecionado
            if (i === this.player.selectedHotbarIndex) {
                slot.setStrokeStyle(4, 0xffff00); // Borda amarela para o selecionado
            } else {
                slot.setStrokeStyle(0); // Sem borda
            }

            // Cria o overlay de cooldown (inicialmente escondido)
            const cooldownOverlay = this.scene.add.rectangle(slot.x, slot.y, slot.width, slot.height, 0x000000, 0.7)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(103)
                .setVisible(false); // Come�a invis�vel
            this.hotbarCooldownOverlays.push(cooldownOverlay);

            // Verifica se a habilidade est� em cooldown e atualiza o overlay
            if (ability && this.player.isAbilityOnCooldown(ability.id)) {
                cooldownOverlay.setVisible(true);
            }
        }
    }

    // NOVO: Inicia a anima��o visual de cooldown para um slot espec�fico
    startHotbarCooldownVisual(abilityId) {
        const abilityIndex = this.player.abilities.findIndex(a => a && a.id === abilityId);
        if (abilityIndex !== -1 && this.hotbarCooldownOverlays[abilityIndex]) {
            this.hotbarCooldownOverlays[abilityIndex].setVisible(true);
        }
    }

    update(time, delta) {
        // Atualiza a barra de vida do jogador
        const healthPercent = Phaser.Math.Clamp(this.player.currentHealth / this.player.maxHealth, 0, 1);
        this.playerHealthBarFill.width = this.playerHealthBarBackground.width * healthPercent;
        this.playerHealthBarFill.x = this.playerHealthBarBackground.x - this.playerHealthBarBackground.width / 2; // Preenche da esquerda para a direita

        // Atualiza os overlays de cooldown na hotbar
        this.player.abilities.forEach((ability, index) => {
            if (ability && this.hotbarCooldownOverlays[index]) {
                const cooldownOverlay = this.hotbarCooldownOverlays[index];
                if (this.player.isAbilityOnCooldown(ability.id)) {
                    cooldownOverlay.setVisible(true);
                    // Opcional: Animar o preenchimento do cooldown (mais avan�ado)
                } else {
                    cooldownOverlay.setVisible(false);
                }
            }
        });
    }
}