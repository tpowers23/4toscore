
// red is 0xff0000, yellow is 0xffff00

class player {
    constructor() {
        this.color;
        this.id;
    }
    move(){
        
    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
        this.currentPlayer = 'red';
        this.logicalBoard = {
            col0: [], col1: [], col2: [], col3: [], col4: [], col5: [], col6: []
        }
        this.xVals = [149,230,310,390,470,550,630];
        this.yVals = [550,471,392,313,234,155];
        this.boardCols = [];
        this.preview = [];
        this.socket;
        this.gameState = 'Initializing';
    }
    
    preload() {
        this.load.image('redArrow', 'assets/redarrow.jpg');
        this.load.image('gameBoard', 'assets/Connect4Board.png');
        this.load.image('boardCol', 'assets/boardCol.png');
        this.load.image('redChip', 'assets/redChip.png');
        this.load.image('yellowChip', 'assets/yellowChip.png');
    }
    
    create() {
        this.socket = io('http://localhost:8081');
        // create sprites for each board column and set them as interactive
        for (var i = 0; i < 7; i++){
            this.boardCols[i] = this.add.sprite(this.xVals[i],350,'boardCol').setInteractive();
        }
        // set event handler for each column when they are clicked on to drop a chip  (70 is y for above)
        this.boardCols[0].on('pointerup', () => {
            this.add.circle(this.xVals[0],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
            this.currentPlayer = 'yellow';
        });
        this.boardCols[0].on('pointerover', () => {
            this.preview[0] = this.add.circle(this.xVals[0],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[0].on('pointerout', () => {
            this.preview[0].destroy();
        });
        this.boardCols[1].on('pointerup', () => {
            this.add.circle(this.xVals[1],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[1].on('pointerover', () => {
            this.preview[1] = this.add.circle(this.xVals[1],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[1].on('pointerout', () => {
            this.preview[1].destroy();
        });
        this.boardCols[2].on('pointerup', () => {
            this.add.circle(this.xVals[2],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[2].on('pointerover', () => {
            this.preview[2] = this.add.circle(this.xVals[2],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[2].on('pointerout', () => {
            this.preview[2].destroy();
        });
        this.boardCols[3].on('pointerup', () => {
            this.add.circle(this.xVals[3],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[3].on('pointerover', () => {
            this.preview[3] = this.add.circle(this.xVals[3],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[3].on('pointerout', () => {
            this.preview[3].destroy();
        });
        this.boardCols[4].on('pointerup', () => {
            this.add.circle(this.xVals[4],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[4].on('pointerover', () => {
            this.preview[4] = this.add.circle(this.xVals[4],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[4].on('pointerout', () => {
            this.preview[4].destroy();
        });
        this.boardCols[5].on('pointerup', () => {
            this.add.circle(this.xVals[5],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[5].on('pointerover', () => {
            this.preview[5] = this.add.circle(this.xVals[5],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[5].on('pointerout', () => {
            this.preview[5].destroy();
        });
        this.boardCols[6].on('pointerup', () => {
            this.add.circle(this.xVals[6],551, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[6].on('pointerover', () => {
            this.preview[6] = this.add.circle(this.xVals[6],70, 35, this.currentPlayer === 'red' ? 0xff0000 : 0xffff00);
        });
        this.boardCols[6].on('pointerout', () => {
            this.preview[6].destroy();
        });
    }

}















var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);