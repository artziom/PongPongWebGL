import * as PIXI from "pixi.js";

export default class Game {
    private readonly title: string;
    private readonly version: string;
    private app: PIXI.Application;

    constructor(title: string, version: string) {
        this.title = title;
        this.version = version;
        document.title = `${this.title} v.${this.version}`;

        this.createPixiApp();
    }

    public run() {
    }

    private createPixiApp() {
        this.app = new PIXI.Application({
            antialias: true
        });
        document.body.appendChild(this.app.view);
    }
}