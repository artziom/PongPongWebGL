import * as PIXI from "pixi.js";
import {State, IState, StateStack} from "./State";
import {TitleState} from "./TitleState";


export default class Game {
    private readonly title: string;
    private readonly version: string;

    private readonly app: PIXI.Application;
    private state: IState;
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
        this.stateStack.registerState(TitleState);
    }
}