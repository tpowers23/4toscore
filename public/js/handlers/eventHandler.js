import GameScene from "../game";
import { Game } from "phaser";

export default class eventHandler {
    constructor() {
        super({ key: eventHandler})
    }

    buildEvents(){
        this.boardCols[0].on('pointerup', () => {
            this.add.circle(this.xVals[0],551, 35, 0xff0000)
        });
        this.boardCols[1].on('pointerup', () => {
            this.add.circle(this.xVals[1],551, 35, 0xff0000)
        });
    }
}