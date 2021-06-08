import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";

export class GameState extends State.AbstractState {
    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        let ball = new PIXI.Graphics();
        ball.beginFill(0xFFFFFF);
        ball.drawRect(0, 0, 10, 10);
        ball.endFill();
        ball.position.set(this.getApp().view.width / 2 - ball.width / 2, this.getApp().view.height / 2 - ball.height / 2);

        this.addChildToStage(ball);
    }

    public update(delta: number): boolean {
        return false;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        return true;
    }
}