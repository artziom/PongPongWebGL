import * as PIXI from "pixi.js";
import {State} from "./states/State";
import {TitleState} from "./states/TitleState";
import {SplashScreenState} from "./states/SplashScreenState";
import {GameState} from "./states/GameState";
import {States} from "./states/StatesIdentifiers";
import {StateStack} from "./states/StateStack";

export default class Game {
    private readonly title: string;
    private readonly version: string;

    private readonly app: PIXI.Application;
    private stateStack: StateStack;

    constructor(title: string, version: string) {
        this.title = title;
        this.version = version;
        document.title = `${this.title} v.${this.version}`;

        this.app = new PIXI.Application({
            antialias: true
        });
        document.body.appendChild(this.app.view);

        this.stateStack = new StateStack(new State.Context(this.app));
        this.registerStates();
    }

    public run() {
        this.app.ticker.add((delta) => this.update(delta));
    }

    private update(delta: number) {
        this.stateStack.update(delta);
    }

    private registerStates() {
        this.stateStack.registerState(States.ID.SplashScreen, SplashScreenState);
        this.stateStack.registerState(States.ID.Title, TitleState);
        this.stateStack.registerState(States.ID.Game, GameState);

        this.stateStack.push(States.ID.SplashScreen);
    }
}