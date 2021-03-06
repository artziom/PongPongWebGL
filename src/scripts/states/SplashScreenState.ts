import * as PIXI from "pixi.js";

import {State} from "./State";
import {States} from "./StatesIdentifiers";
import {StateStack} from "./StateStack";
import {Event} from "../Event";

export class SplashScreenState extends State.AbstractState {
    public title: PIXI.Text;
    private time: number;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);
        this.time = 0;

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            align: "center"
        });
        this.title = new PIXI.Text("ArtZiom presents", style);
        this.title.position.set(this.getApp().screen.width / 2, this.getApp().screen.height / 2);
        this.title.anchor.set(0.5);

        this.addChildToStage(this.title);
    }

    public update(delta: number): boolean {
        this.time += delta;
        if (this.time > 180) {
            this.requestStackPop();
            this.requestStackPush(States.ID.Title);
        }
        return false;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        return true;
    }
}