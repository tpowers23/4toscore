// red is 0xff0000, yellow is 0xffff00
import GameScene from './gamescene.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GameScene]
};

const game = new Phaser.Game(config);