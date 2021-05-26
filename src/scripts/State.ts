import * as PIXI from "pixi.js";

export default class State {
    public showText: boolean;
    public titleString: string;
    public textEffectTime: number;

    public title: PIXI.Text;
    private stage: PIXI.Container;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.stage = this.app.stage;

        this.showText = true;
        this.titleString = "Pong Pong\nPress [space] to start game";
        this.textEffectTime = 0;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text(this.titleString, style);
        this.title.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.title.anchor.set(0.5);

        this.stage.addChild(this.title);
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