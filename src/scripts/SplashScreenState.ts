import * as PIXI from "pixi.js";

import {State} from "./State";

export class SplashScreenState extends State.IState {
    public title: PIXI.Text;
    private time: number;

    constructor(stack: State.StateStack, context: State.Context) {
        super(stack, context);
        this.time = 0;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text("ArtZiom presents", style);
        this.title.position.set(this.getApp().screen.width / 2, this.getApp().screen.height / 2);
        this.title.anchor.set(0.5);

        this.getStage().addChild(this.title);
    }

    public update(delta: number): boolean {
        this.time += delta;
        if (this.time > 180) {
            this.requestStackPop();
            this.requestStackPush("Title");
        }
        return false;
    }
}