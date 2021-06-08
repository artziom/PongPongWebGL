import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {States} from "./StatesIdentifiers";
import {Event} from "../Event";

export class TitleState extends State.AbstractState {
    public gameTitle: PIXI.Text;
    public pressAnyKey: PIXI.Text;
    public showText: boolean;
    public textEffectTime: number;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        const gameTitleStyle = new PIXI.TextStyle({
            fontSize: 48,
            fill: 0xFFFFFF,
            align: "center"
        });
        this.gameTitle = new PIXI.Text("Pong Pong", gameTitleStyle);
        this.gameTitle.position.set(this.getApp().screen.width / 2, this.getApp().screen.height / 2);
        this.gameTitle.anchor.set(0.5);
        this.addChildToStage(this.gameTitle);

        const pressAnyKeyStyle = new PIXI.TextStyle({
            fontSize: 20,
            fill: 0xFFFFFF,
            align: "center"
        });
        this.showText = true;
        this.textEffectTime = 0;
        this.pressAnyKey = new PIXI.Text("Press Any Key", pressAnyKeyStyle);
        this.pressAnyKey.position.set(this.getApp().screen.width / 2, this.getApp().screen.height / 2 + 100);
        this.pressAnyKey.anchor.set(0.5);
        this.addChildToStage(this.pressAnyKey);
    }

    public update(delta: number): boolean {
        this.textEffectTime += this.getApp().ticker.elapsedMS;

        if (this.textEffectTime >= 1000) {
            this.showText = !this.showText;

            if (this.showText) {
                this.pressAnyKey.visible = true;
            } else {
                this.pressAnyKey.visible = false;
            }
            this.textEffectTime = 0;
        }

        return false;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        if(eventKey.code === "KeyS" && eventKey.type === Event.Type.KeyReleased){
            this.requestStackPop();
            this.requestStackPush(States.ID.Game);
            return false;
        }

        return true;
    }
}