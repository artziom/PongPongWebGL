import * as PIXI from "pixi.js";
import {State} from "./State";
import {TitleState} from "./TitleState";
import {SplashScreenState} from "./SplashScreenState";
import {GameState} from "./GameState";


export default class Game {
    private readonly title: string;
    private readonly version: string;

    private readonly app: PIXI.Application;
    private stateStack: State.StateStack;

    constructor(title: string, version: string) {
        this.title = title;
        this.version = version;
        document.title = `${this.title} v.${this.version}`;

        this.app = new PIXI.Application({
            antialias: true
        });
        document.body.appendChild(this.app.view);

        this.stateStack = new State.StateStack(new State.Context(this.app));
        this.registerStates();
    }

    public run() {
        this.app.ticker.add((delta) => this.update(delta));
    }

    private update(delta: number) {
        this.stateStack.update(delta);
    }

    private registerStates() {
        this.stateStack.registerState("SplashScreen", SplashScreenState);
        this.stateStack.registerState("Title", TitleState);
        this.stateStack.registerState("Game", GameState);

        this.stateStack.push("SplashScreen");
    }
}