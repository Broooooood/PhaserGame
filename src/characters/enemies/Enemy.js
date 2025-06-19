// src/characters/enemies/Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.player = player;

        // Adicionar à cena e habilitar corpo de física
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this); // Cria o corpo de física padrão

        // Aumentar escala do inimigo para 1.5x (visual)
        this.setScale(1.5);

        // --- Ajustar o corpo de colisão (hitbox) ---
        // Obtém as dimensões originais da textura (antes da escala visual)
        const originalWidth = this.texture.get().width;
        const originalHeight = this.texture.get().height;

        // === VALORES PARA AJUSTAR ===
        // Experimente com estes percentuais para definir o tamanho da hitbox
        // Por exemplo, 0.5 = 50% da largura original, 0.7 = 70% da altura original
        const hitboxWidthPercentage = 0.5;  // 50% da largura original da imagem
        const hitboxHeightPercentage = 0.7; // 70% da altura original da imagem

        const actualHitboxWidth = originalWidth * hitboxWidthPercentage;
        const actualHitboxHeight = originalHeight * hitboxHeightPercentage;

        // Calcula o offset para centralizar a hitbox horizontalmente e puxar para baixo verticalmente
        // offsetX: Centraliza a hitbox na largura original da imagem
        const offsetX = (originalWidth - actualHitboxWidth) / 2;

        // offsetY: Posiciona a hitbox verticalmente.
        // `originalHeight - actualHitboxHeight` alinha a base da hitbox com a base da imagem.
        // Adicione um valor positivo para "puxar para baixo" ainda mais.
        // Subtraia um valor para "subir" a hitbox (se ela estiver muito baixa).
        const offsetY = originalHeight - actualHitboxHeight + 5; // Ajuste o '5' conforme necessário!

        // Aplica o novo tamanho e offset à hitbox
        this.body.setSize(actualHitboxWidth, actualHitboxHeight);
        this.body.setOffset(offsetX, offsetY);
        // --- Fim do ajuste da hitbox ---

        this.speed = 50;
        this.visionRange = 150;

        this.maxHealth = 50; // Este será sobrescrito em Wolf/Goblin
        this.currentHealth = this.maxHealth;
        this.isDead = false;

        this.setCollideWorldBounds(true);

        this.healthBarBackground = this.scene.add.rectangle(0, 0, 40, 5, 0x000000).setOrigin(0.5);
        this.healthBarFill = this.scene.add.rectangle(0, 0, 40, 5, 0xff0000).setOrigin(0.5);

        this.scene.events.on('update', this.updateHealthBar, this);
    }


  update(time, delta) {
    if (this.isDead) {
      this.setVelocity(0);
      return;
    }

    // Calculate distance to player
    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If player is within vision range, move towards player
    if (distance < this.visionRange) {
      const angle = Math.atan2(dy, dx);
      this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
    } else {
      this.setVelocity(0);
    }

    // Update health bar position
    this.updateHealthBar();
  }
  
  updateHealthBar() {
    if (this.isDead) {
      this.healthBarBackground.setVisible(false);
      this.healthBarFill.setVisible(false);
      return;
    }

    const barX = this.x;
    const barY = this.y - this.displayHeight / 2 - 10;

    // Atualiza posi��o das barras
    this.healthBarBackground.setPosition(barX, barY);
    this.healthBarFill.setPosition(barX, barY);

    // Atualiza largura proporcional da barra de vida
    const percentage = this.currentHealth / this.maxHealth;
    this.healthBarFill.width = this.healthBarBackground.width * percentage;

    this.healthBarBackground.setVisible(true);
    this.healthBarFill.setVisible(true);
  }


  takeDamage(amount) {
    if (this.isDead) return;

    this.currentHealth -= amount;
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0);

    // Hide enemy sprite and health bar
    this.setVisible(false);
    this.healthBarBackground.setVisible(false);
    this.healthBarFill.setVisible(false);

    // Disable physics body
    this.body.enable = false;

    // Optional: you could play death animation, spawn loot, etc.
  }

  dealDamage(player) {
    if (!player.isInvincible) {
      player.currentHealth -= 10; // O dano base é 10
      player.isInvincible = true;

      this.scene.time.delayedCall(1000, () => {
        player.isInvincible = false;
      });
    }
  }
}
