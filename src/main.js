import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

// Use o config que voc� exportou no config.js
import './config.js';

window.config.scene = [GameScene];

const game = new Phaser.Game(window.config);
