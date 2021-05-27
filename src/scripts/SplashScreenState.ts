import * as PIXI from "pixi.js";

import {State} from "./State";

export class SplashScreenState implements State.IState {
    public context: State.Context;

    public title: PIXI.Text;

    constructor(context: State.Context) {
        this.context = context;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text("ArtZiom presents", style);
        this.title.position.set(this.context.getApp().screen.width / 2, this.context.getApp().screen.height / 2);
        this.title.anchor.set(0.5);

        this.context.getStage().addChild(this.title);
    }

    update(delta: number): void {
    }
}