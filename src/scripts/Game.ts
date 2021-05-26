import * as PIXI from "pixi.js";
import State from "./State";

export default class Game {
    private readonly title: string;
    private readonly version: string;

    private readonly app: PIXI.Application;
    private state: State;

    constructor(title: string, version: string) {
        this.title = title;
        this.version = version;
        document.title = `${this.title} v.${this.version}`;

        this.app = new PIXI.Application({
            antialias: true
        });
        document.body.appendChild(this.app.view);

        this.state = new State(this.app);
    }

    public run() {
        this.app.ticker.add((delta) => this.update(delta));
    }

    private update(delta: number) {
        this.state.update(delta);
    }
}