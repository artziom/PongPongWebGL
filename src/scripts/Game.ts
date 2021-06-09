import * as PIXI from "pixi.js";
import {State} from "./states/State";
import {TitleState} from "./states/TitleState";
import {SplashScreenState} from "./states/SplashScreenState";
import {GameState} from "./states/GameState";
import {States} from "./states/StatesIdentifiers";
import {StateStack} from "./states/StateStack";
import {Event} from "./Event";

export default class Game {
    private readonly title: string;
    private readonly version: string;

    private readonly app: PIXI.Application;
    private stateStack: StateStack;
    private events: Array<Event.Key>;

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

        this.events = [];

        window.onkeydown = (e) => {
            this.events.push(new Event.Key(Event.Type.KeyPressed, e.code, false, false, false));
        };

        window.onkeyup = (e) => {
            this.events.push(new Event.Key(Event.Type.KeyReleased, e.code, false, false, false));
        };
    }

    public run() {
        this.app.ticker.add((delta) => this.update(delta));
    }

    private update(delta: number) {
        let eventKey: Event.Key | false;
        while (eventKey = this.popEvent()) {
            this.stateStack.handleEvent(eventKey);
        }

        this.stateStack.update(delta);
    }

    private registerStates() {
        this.stateStack.registerState(States.ID.SplashScreen, SplashScreenState);
        this.stateStack.registerState(States.ID.Title, TitleState);
        this.stateStack.registerState(States.ID.Game, GameState);

        this.stateStack.push(States.ID.SplashScreen);
    }

    private popEvent(): Event.Key | false {
        return this.events.shift() ?? false;
    }
}