import phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }
    

     preload() {
        this.load.image('redArrow', 'assets/redarrow.jpg');
        this.load.image('blackArrow', 'assets/blackarrow.jpg');
        this.load.image('gameBoard', 'assets/Connect4Board.png');
        this.load.image('boardCol', 'assets/boardCol.png')
    }
    
     create() {
        this.socket = io('http://localhost:8081');
        this.add.sprite(100,100,'boardCol');
      /*  for (var i = 0; i < 7; i++){
            boardCol[i] = this.add.sprite(100+(i*100), 100, 'boardCol');

        }  */
    }
    
     update() {}
    
    }