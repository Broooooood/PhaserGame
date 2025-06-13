import Phaser from 'phaser'

export default class MyScene extends Phaser.Scene {
  constructor() {
    super('MyScene')
  }

  preload() {
    this.load.image('logo', 'assets/logo.png') // precisa estar no caminho certo
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logo')
  }
}
