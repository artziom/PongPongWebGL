import * as PIXI from "pixi.js";

import {State} from "./State";
import {StateStack} from "./StateStack";

export class TitleState extends State.IState {
    public title: PIXI.Text;
    public showText: boolean;
    public titleString: string;
    public textEffectTime: number;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        this.showText = true;
        this.titleString = "Pong Pong\nPress [space] to start game";
        this.textEffectTime = 0;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text(this.titleString, style);
        this.title.position.set(this.getApp().screen.width / 2, this.getApp().screen.height / 2);
        this.title.anchor.set(0.5);

        this.getStage().addChild(this.title);
    }

    public update(delta: number): boolean {
        this.textEffectTime += this.getApp().ticker.elapsedMS;

        if (this.textEffectTime >= 1000) {
            this.showText = !this.showText;

            if (this.showText) {
                this.title.visible = true;
            } else {
                this.title.visible = false;
            }
            this.textEffectTime = 0;
        }

        return false;
    }
}