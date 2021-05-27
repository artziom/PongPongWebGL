import * as PIXI from "pixi.js";

import {State, IState} from "./State";

export class TitleState implements IState {
    public context: State.Context;

    public title: PIXI.Text;
    public showText: boolean;
    public titleString: string;
    public textEffectTime: number;

    constructor(context: State.Context) {
        this.context = context;

        this.showText = true;
        this.titleString = "Pong Pong\nPress [space] to start game";
        this.textEffectTime = 0;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text(this.titleString, style);
        this.title.position.set(this.context.getApp().screen.width / 2, this.context.getApp().screen.height / 2);
        this.title.anchor.set(0.5);

        this.context.getStage().addChild(this.title);
    }

    public update(delta: number) {
        this.textEffectTime += delta;

        if (this.textEffectTime >= 60) {
            this.showText = !this.showText;

            if (this.showText) {
                this.title.visible = true;
            } else {
                this.title.visible = false;
            }
            this.textEffectTime = 0;
        }
    }
}