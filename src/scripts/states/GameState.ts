import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";
import {Entity} from "../Entity";
import {Vector2D} from "../utils/Vector2D";

export class GameState extends State.AbstractState {
    private leftRacket: Entity;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        const racketSize = new Vector2D(10,75);
        this.leftRacket = new Entity("Ball", 10, new Vector2D(30,this.getApp().view.height / 2 - racketSize.y / 2), racketSize);
        this.addChildToStage(this.leftRacket.getContainer());
    }

    public update(delta: number): boolean {
        this.leftRacket.update();

        return true;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        if (eventKey.type == Event.Type.KeyPressed) {
            if (eventKey.code == "KeyW") {
                this.leftRacket.setMove("up", true);
            }

            if (eventKey.code == "KeyS") {
                this.leftRacket.setMove("down", true);
            }
        }

        if (eventKey.type == Event.Type.KeyReleased) {
            if (eventKey.code == "KeyW") {
                this.leftRacket.setMove("up", false);
            }

            if (eventKey.code == "KeyS") {
                this.leftRacket.setMove("down", false);
            }
        }

        return true;
    }
}