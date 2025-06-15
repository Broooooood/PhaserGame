export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0.5);
this.body.setSize(this.width * 0.5, this.height * 0.7);
this.body.setOffset(this.width * 0.15, this.height * 0.4);
        this.setCollideWorldBounds(true);

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;


        //debug
        this.debugGraphics = scene.add.graphics();

        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.attackButton = scene.input.activePointer;

        this.speed = 150;
        this.runSpeed = 250;
        this.attackMoveSpeed = 50;

        this.isAttacking = false;
        this.attackCombo = 0;
        this.attackTimer = 0;
        this.comboResetTime = 600;

        this.createAnimations(scene);
        this.anims.play('idle');

        // Hitbox de ataque invisível
        this.attackHitbox = scene.add.rectangle(0, 0, 60, 80, 0xff0000, 0.3); //0.3 debug
        scene.physics.add.existing(this.attackHitbox);
        this.attackHitboxBody = this.attackHitbox.body;
        this.attackHitboxBody.setAllowGravity(false);
        this.attackHitboxBody.setEnable(false);
    }

    createAnimations(scene) {
        if (!scene.anims.exists('idle')) {
            scene.anims.create({
                key: 'idle',
                frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!scene.anims.exists('walk')) {
            scene.anims.create({
                key: 'walk',
                frames: scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!scene.anims.exists('run')) {
            scene.anims.create({
                key: 'run',
                frames: scene.anims.generateFrameNumbers('player_run', { start: 0, end: 7 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!scene.anims.exists('attack1')) {
            scene.anims.create({
                key: 'attack1',
                frames: scene.anims.generateFrameNumbers('player_attak1', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('attack2')) {
            scene.anims.create({
                key: 'attack2',
                frames: scene.anims.generateFrameNumbers('player_attak2', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('attack3')) {
            scene.anims.create({
                key: 'attack3',
                frames: scene.anims.generateFrameNumbers('player_attak3', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: 0
            });
        }

        if (!scene.anims.exists('attackRun')) {
            scene.anims.create({
                key: 'attackRun',
                frames: scene.anims.generateFrameNumbers('player_attakRun', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    update(time) {
        if (this.attackButton.isDown && !this.isAttacking) {
            this.handleAttack(time);
            return;
        }

        const isRunning = this.shiftKey.isDown && !this.isAttacking;
        let velocity = this.speed;

        if (this.isAttacking) {
            velocity = this.attackMoveSpeed;
        } else if (isRunning) {
            velocity = this.runSpeed;
        }

        if (this.flipX) {
          this.body.setOffset(50, this.height * 0.4); // valor fixo para a esquerda
        } else {
          this.body.setOffset(5, this.height * 0.4);  // valor fixo para a direita
        }

        let moving = false;
        this.setVelocity(0);

        if (this.keyA.isDown) {
            this.setVelocityX(-velocity);
            // Alterado de setScale para flipX
            this.flipX = true; // Vira para a esquerda
            moving = true;
        } else if (this.keyD.isDown) {
            this.setVelocityX(velocity);
            // Alterado de setScale para flipX
            this.flipX = false; // Vira para a direita (orientação original)
            moving = true;
        }

        if (this.keyW.isDown) {
            this.setVelocityY(-velocity);
            moving = true;
        } else if (this.keyS.isDown) {
            this.setVelocityY(velocity);
            moving = true;
        }

        // Se o jogador estiver se movendo diagonalmente, o flipX deve prevalecer da última direção horizontal.
        // Se ele está se movendo apenas verticalmente, a direção horizontal não muda.

        if (this.isAttacking) return;

        if (moving) {
            this.anims.play(isRunning ? 'run' : 'walk', true);
        } else {
            this.anims.play('idle', true);
        }

        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0x00ff00); // Verde para corpo do player
        this.debugGraphics.strokeRect(
            this.body.x, this.body.y,
            this.body.width, this.body.height
        );

        this.debugGraphics.lineStyle(1, 0xff0000); // Vermelho para hitbox de ataque
        this.debugGraphics.strokeRect(
            this.attackHitbox.x - this.attackHitbox.width / 2,
            this.attackHitbox.y - this.attackHitbox.height / 2,
            this.attackHitbox.width,
            this.attackHitbox.height
        );
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) this.currentHealth = 0;
        // Você pode colocar efeitos de dano aqui também
    }

    handleAttack(time) {
        if (this.isAttacking) return;

        const isRunning = this.shiftKey.isDown && !this.isAttacking;

        if (isRunning && this.attackCombo === 0) {
            this.isAttacking = true;
            this.anims.play('attackRun', true);
            this.attackTimer = time;
            this.attackCombo = 0;
            // Ajusta a velocidade de ataque baseada na direção atual
            this.setVelocity(this.attackMoveSpeed * (this.flipX ? -1 : 1), 0);

            this.once('animationcomplete', () => {
                this.isAttacking = false;
                this.attackCombo = 1;
                this.attackTimer = this.scene.time.now;
                if (this.attackButton.isDown) {
                    this.handleAttack(this.scene.time.now);
                }
            });
            return;
        }

        this.isAttacking = true;
        this.attackCombo++;
        if (this.attackCombo > 3) this.attackCombo = 1;

        const animKey = `attack${this.attackCombo}`;
        this.anims.play(animKey, true);
        this.attackTimer = time;

        // Ajusta a velocidade de ataque baseada na direção atual
        this.setVelocity(this.attackMoveSpeed * (this.flipX ? -1 : 1), 0);

        // Hitbox de ataque ativada
        // A posição da hitbox deve considerar o flipX do player
        const offsetX = this.flipX ? -40 : 40; // Se virado, o offset é negativo
        const offsetY = 20;
        this.attackHitbox.setPosition(this.x + offsetX, this.y + offsetY);
        this.attackHitboxBody.setEnable(true);

        this.scene.time.delayedCall(200, () => {
            this.attackHitboxBody.setEnable(false);
        });

        this.once('animationcomplete', () => {
            this.isAttacking = false;
            this.attackHitboxBody.setEnable(false);

            if (this.attackButton.isDown) {
                this.handleAttack(this.scene.time.now);
            } else {
                this.scene.time.delayedCall(this.comboResetTime, () => {
                    if (!this.isAttacking && this.scene.time.now - this.attackTimer >= this.comboResetTime) {
                        this.attackCombo = 0;
                    }
                });
            }
        });
    }
}